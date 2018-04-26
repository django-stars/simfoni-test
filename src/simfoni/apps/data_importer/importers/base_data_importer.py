import abc

from django.utils.translation import ugettext_lazy as _

from rest_framework import serializers
from rest_framework.settings import api_settings


class BaseDataImporter(abc.ABC):
    """
    Declare common interface for data importers.
    Library or file format dependent code should be provided in _get_rows_iterator.

    Usage example:
        template = ImporterTemplate(('field1', 'field2'), TwoFieldsSerializerCls)
        importer = ImporterSubclass(request.data['file'], template)
        importer.is_valid(raise_exception=True)
        importer.parse()
        print(importer.report)
    """
    WRONG_FILE_CONTENT_MESSAGE = _('Invalid file content. Please check amount of columns & headers naming.')

    def __init__(self, source_file, template):
        """
        source_file - UploadedFile instance. Usually is taken from request like request.data['file'].
                      But path to fine will also work.
        template - ImporterTemplate tuple of 'fields' (list/tuple) and 'serializer' (drf serializer)
        """
        self.source_file = source_file
        self.headers = template.fields
        self.serializer = template.serializer

        self.rows_imported = 0
        self.rows_skipped = 0

        self.is_parsed = False
        self.errors = {}

        self._is_valid = None
        self._iterator = None

    def is_valid(self, raise_exception=False):
        """
        Check file content:
        - We assume that file has a header in the first row;
        - Also we check that columns amount corresponds amount of serializer fields.
        """
        if not self._is_valid:
            self._iterator = self._get_rows_iterator()
            header_row = next(self._iterator)
            try:
                assert len(header_row) == len(self.headers)
                for cell, field_name in zip(header_row, self.headers):
                    assert cell.value.lower().strip() == field_name.lower()
            except AssertionError:
                if raise_exception:
                    raise serializers.ValidationError(self.WRONG_FILE_CONTENT_MESSAGE)
                self.errors[api_settings.NON_FIELD_ERRORS_KEY] = [self.WRONG_FILE_CONTENT_MESSAGE, ]
                self._is_valid = False
            else:
                self._is_valid = True
        return self._is_valid

    def parse(self):
        """
        Reads file data by passing rows one by one into self.serializer. For valid rows 'save' is called.
        Changes values for rows_imported and rows_skipped.
        Idempotent.
        """
        if not self.is_parsed:
            assert self._is_valid is not None, 'You need to call is_valid before parsing.'
            assert self._is_valid, 'File structure doesn\'t correspond provided serializer. Check file content.'
            for row in self._iterator:
                mapped_row = {
                    serializer_field: row.value for serializer_field, row in zip(self.serializer.Meta.fields, row)
                }
                row_serializer = self.serializer(data=mapped_row)
                if row_serializer.is_valid():
                    self.rows_imported += 1
                    row_serializer.save()
                else:
                    self.rows_skipped += 1

    @property
    def report(self):
        """
        Returns parsing statistic. Should be called after 'parse' method.
        If you call it before parsing - zeros would be returned
        """
        return {
            'imported': self.rows_imported,
            'skipped': self.rows_skipped,
        }

    @abc.abstractmethod
    def _get_rows_iterator(self):
        raise NotImplementedError  # in addition ensure that nobody will call super in inheritors
