SIMFONI_IMPORT_MIME_TYPES = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',       #.xlsx
    'application/octet-stream',  # windows fails to set proper content type to uploaded file
]

SIMFONI_DEFAULT_FILE_MAX_SIZE = 1024 * 1024 * 10  # 10 Mb
