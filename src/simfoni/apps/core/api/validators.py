from django.utils.translation import ugettext_lazy as _
from django.conf import settings
from django.template.defaultfilters import filesizeformat

from rest_framework import serializers


class ImportFileMimeTypeValidator:
    message = _('File has unsupported MIME type "{mime_type}".')

    def __init__(self, allowed_mime_types=settings.SIMFONI_IMPORT_MIME_TYPES, *args, **kwargs):
        self.allowed_mime_types = allowed_mime_types
        super().__init__(*args, **kwargs)

    def __call__(self, value):
        mime_type = getattr(value, 'content_type', '')
        if mime_type.lower() not in self.allowed_mime_types:
            if not mime_type:
                mime_type = 'unknown'
            raise serializers.ValidationError(self.message.format(mime_type=mime_type))


class FileMaxSizeValidator:
    message = _('File size should be less than {size}.')

    def __init__(self, max_size=settings.SIMFONI_DEFAULT_FILE_MAX_SIZE, *args, **kwargs):
        self.max_size = max_size
        super().__init__(*args, **kwargs)

    def __call__(self, value):
        if value.size > self.max_size:
            human_readable_size = filesizeformat(self.max_size)
            raise serializers.ValidationError(self.message.format(size=human_readable_size))
