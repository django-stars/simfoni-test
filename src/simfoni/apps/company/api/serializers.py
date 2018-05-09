from rest_framework import serializers

from company.models import RawCompany, Match, Company


class RawCompanyImportSerializer(serializers.ModelSerializer):
    """
    As we use this serializer for importing data - the fields cannot be __all__ -
    we need to know order of field names during the import
    """

    class Meta:
        model = RawCompany
        fields = ('name', )


class CompanySerializer(serializers.ModelSerializer):
    is_completed = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = ('uuid', 'name', 'is_completed', )

    def get_is_completed(self, instance):
        return not instance.matches.filter(is_accepted=True).exists()


class MatchSerializer(serializers.ModelSerializer):
    company = serializers.SerializerMethodField()
    raw_company = serializers.SerializerMethodField()

    class Meta:
        model = Match
        fields = ('uuid', 'score', 'company', 'raw_company', 'is_accepted', )

    def get_company(self, instance):
        return instance.company.name

    def get_raw_company(self, instance):
        return instance.raw_company.name


class MatchAcceptSerializer(serializers.ModelSerializer):

    class Meta:
        model = Match
        fields = ('uuid', 'is_accepted',)
