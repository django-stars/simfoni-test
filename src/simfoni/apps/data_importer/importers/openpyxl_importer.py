from openpyxl import load_workbook

from data_importer.importers.base_data_importer import BaseDataImporter


class OpenpyxlDataImporter(BaseDataImporter):

    def _get_rows_iterator(self):
        return load_workbook(self.source_file, read_only=True).active.rows
