from django.db.models import Min, Max
from django.utils.translation import ugettext

from rest_framework import serializers
from rest_framework.fields import CreateOnlyDefault

from revenue.models import RevenueGroup, Revenue


class RevenueGroupSerializer(serializers.ModelSerializer):

    class Meta:
        model = RevenueGroup
        fields = '__all__'

        # CreateOnlyDefault will be provided on object creation if they're not provided by FE side
        extra_kwargs = {
            'revenue_from': {
                'default': CreateOnlyDefault(lambda: Revenue.objects.aggregate(min=Min('revenue'))['min']),
            },
            'revenue_to': {
                'default': CreateOnlyDefault(lambda: Revenue.objects.aggregate(max=Max('revenue'))['max']),
            },
        }

    def validate(self, data):
        if not self.instance:
            # On instance creation when revenue data is not uploaded the CreateOnlyDefault will return None.
            # In this case we need to trigger required error for fields.
            required_errors = {}
            if data['revenue_from'] is None:
                required_errors.update({'revenue_from': [self.fields['revenue_from'].error_messages['required']]})
            if data['revenue_to'] is None:
                required_errors.update({'revenue_to': [self.fields['revenue_to'].error_messages['required']]})
            if required_errors:
                raise serializers.ValidationError(required_errors)

        revenue_from = data.get('revenue_from') or self.instance.revenue_from
        revenue_to = data.get('revenue_to') or self.instance.revenue_to
        if revenue_from >= revenue_to:
            raise serializers.ValidationError(ugettext("Invalid range"))
        return data
