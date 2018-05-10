from copy import deepcopy

from rest_framework import status, generics
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from company.api.serializers import (
    RawCompanyImportSerializer, CompanySerializer, MatchSerializer, MatchAcceptSerializer
)
from company.matcher import match_companies
from company.models import Company, Match, RawCompany
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

                match_companies(RawCompany.objects.filter(matches=None))
                report = deepcopy(importer.report)
                # TODO: update report with normalisation data
                report['normalized'] = 333
                report['duplicate'] = 666
                return Response(report, status=status.HTTP_200_OK)


class FlushCompaniesAPIView(APIView):
    def post(self, request, *args, **kwargs):
        Company.objects.all().delete()
        Match.objects.all().delete()
        RawCompany.objects.all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CompaniesListAPIView(generics.ListAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer


class CompanyMatchesListAPIView(APIView):
    def get(self, request, pk, *args, **kwargs):
        company = get_object_or_404(Company, pk=pk)
        return Response(MatchSerializer(company.matches.filter(is_accepted=False), many=True).data)


class MatchUpdateDeleteAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Match.objects.all()
    serializer_class = MatchAcceptSerializer

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)

        # in addition we need to drop all other matches for raw company record
        instance = self.get_object()
        if instance.is_accepted:
            instance.raw_company.matches.exclude(pk=instance.uuid).delete()
            # also there is a post_delete signal for Match object which will remove Companies without matches
        return response
