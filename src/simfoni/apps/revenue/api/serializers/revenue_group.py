from rest_framework import serializers

from revenue.models import RevenueGroup


class RevenueGroupSerializer(serializers.ModelSerializer):

    class Meta:
        model = RevenueGroup
        fields = '__all__'
