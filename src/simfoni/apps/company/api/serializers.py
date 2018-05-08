from rest_framework import serializers

from company.models import RawCompany, Match


class RawCompanyImportSerializer(serializers.ModelSerializer):
    """
    As we use this serializer for importing data - the fields cannot be __all__ -
    we need to know order of field names during the import
    """

    class Meta:
        model = RawCompany
        fields = ('name', )


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = RawCompany
        fields = '__all__'


class MatchSerializer(serializers.ModelSerializer):
    company = serializers.SerializerMethodField()
    raw_company = serializers.SerializerMethodField()

    class Meta:
        model = Match
        fields = '__all__'

    def get_company(self, instance):
        return instance.company.name

    def get_raw_company(self, instance):
        return instance.raw_company.name
