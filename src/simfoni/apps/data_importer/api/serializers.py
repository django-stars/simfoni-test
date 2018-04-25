from rest_framework import serializers

from core.api.validators import FileMaxSizeValidator, ImportFileMimeTypeValidator


class ImportSerializer(serializers.Serializer):
    file = serializers.FileField(
        required=True, allow_null=False,
        validators=[ImportFileMimeTypeValidator(), FileMaxSizeValidator(), ]
    )
