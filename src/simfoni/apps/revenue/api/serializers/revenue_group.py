from rest_framework import serializers

from revenue.models import RevenueGroup


class RevenueGroupSerializer(serializers.ModelSerializer):

    class Meta:
        model = RevenueGroup
        fields = '__all__'

    def validate(self, data):
        if data['revenue_from'] >= data['revenue_to']:
            raise serializers.ValidationError("Invalid range")
        return data
