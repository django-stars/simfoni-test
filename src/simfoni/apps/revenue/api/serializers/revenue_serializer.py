from rest_framework import serializers

from revenue.models import Revenue


class RevenueImportSerializer(serializers.ModelSerializer):
    """
    As we use this serializer for importing data - the fields cannot be __all__ -
    we need to know order of field names during the import
    """

    class Meta:
        model = Revenue
        fields = ('customer_name', 'revenue', )
