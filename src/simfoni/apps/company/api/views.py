from copy import deepcopy

from django.db.models import signals

from rest_framework import status, generics
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from company.api.serializers import (
    RawCompanyImportSerializer, CompanySerializer, MatchSerializer, MatchAcceptSerializer
)
from company.matcher.companies_matcher import match_companies
from company.models import Company, Match, RawCompany
from company.models.match import remove_companies_without_match
from data_importer.api.serializers import ImportSerializer
from data_importer.importer_template import ImporterTemplate
from data_importer.importers.openpyxl_importer import OpenpyxlDataImporter


class UploadCompaniesAPIView(APIView):
    IMPORTER_TEMPLATE = ImporterTemplate(
        fields=('Supplier Name', ),
        serializer=RawCompanyImportSerializer,
        borders_model_field=None,
    )

    def post(self, request, *args, **kwargs):
        serializer = ImportSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            importer = OpenpyxlDataImporter(serializer.validated_data['file'], self.IMPORTER_TEMPLATE)
            if importer.is_valid(raise_exception=True):
                importer.parse()  # saves rows to db
                match_report = match_companies(RawCompany.objects.filter(matches=None))

                report = deepcopy(importer.report)
                report.update(match_report)
                report['duplicate'] = report['imported'] - report['normalized']
                return Response(report, status=status.HTTP_200_OK)


class FlushCompaniesAPIView(APIView):
    def post(self, request, *args, **kwargs):
        # signals greatly slow downs removal process. The other possible solution was adding logic from signal
        # into the MatchUpdateDeleteAPIView, but in this case changes made from Django Admin could lead to
        # data inconsistency and artifacts on FE.
        signals.post_delete.disconnect(remove_companies_without_match, sender=Match)

        Company.objects.all().delete()
        RawCompany.objects.all().delete()
        Match.objects.all().delete()

        signals.post_delete.connect(remove_companies_without_match, sender=Match)
        return Response(status=status.HTTP_204_NO_CONTENT)


class CompaniesListAPIView(generics.ListAPIView):
    queryset = Company.objects.all().order_by('name')  # companies without matches are deleted by signal
    serializer_class = CompanySerializer


class CompanyMatchesListAPIView(APIView):
    def get(self, request, pk, *args, **kwargs):
        company = get_object_or_404(Company, pk=pk)
        return Response(MatchSerializer(company.matches.filter(is_accepted=False).order_by('-score'), many=True).data)


class MatchUpdateDeleteAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Match.objects.all()
    serializer_class = MatchAcceptSerializer

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)

        # in addition we need to drop all other matches for raw company record
        # also there is a post_delete signal for Match object which will remove Companies without matches
        instance = self.get_object()
        if instance.is_accepted:
            instance.raw_company.matches.exclude(pk=instance.uuid).delete()
            if not instance.company.matches.exclude(is_accepted=True).exists():
                instance.company.is_completed = True
                instance.company.save()
        return response
