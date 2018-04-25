from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from data_importer.api.serializers import ImportSerializer
from data_importer.importer_template import ImporterTemplate
from data_importer.importers.openpyxl_importer import OpenpyxlDataImporter
from revenue.api.serializers.revenue_group import RevenueGroupSerializer
from revenue.api.serializers.revenue_serializer import RevenueImportSerializer
from revenue.models import RevenueGroup


# APIViews were used instead of ViewSets because it's more verbose/explicit.
# Such declarative way is more clear to configure different permissions and serializers for each http method.
# (when business logic becomes more complicated)


class RevenueGroupListCreateAPIView(generics.ListCreateAPIView):
    queryset = RevenueGroup.objects.all()
    serializer_class = RevenueGroupSerializer


class RevenueGroupRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RevenueGroup.objects.all()
    serializer_class = RevenueGroupSerializer


class RevenueRetrieveUploadAPIView(APIView):
    IMPORTER_TEMPLATE = ImporterTemplate(
        ('customer names', 'revenue'),
        RevenueImportSerializer
    )

    def get(self, request, *args, **kwargs):
        groups = RevenueGroup.objects.all()
        data = []
        for group in groups:
            data = {
                'name': group.name,
                'value': 33
            }
        # show not displayed?
        return Response(
            data,
            status=status.HTTP_200_OK
        )

    # def post(self, request):

    def post(self, request, *args, **kwargs):
        serializer = ImportSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            # we decided to do such workflow - on each file upload we clear previous data
            self.IMPORTER_TEMPLATE.serializer.Meta.model.objects.all().delete()
            importer = OpenpyxlDataImporter(serializer.validated_data['file'], self.IMPORTER_TEMPLATE)
            if importer.is_valid(raise_exception=True):
                importer.parse()  # saves rows to db
                return Response(importer.report, status=status.HTTP_200_OK)

# TODO: Describe everything in READMEEEEE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
