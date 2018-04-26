from collections import namedtuple


# Declare structure which will contain info about expected file column names and serializer which will handle rows.
# As we don't need any methods - we don't create a class.
# But it would be very easy to change it, if new logic will appear

# fields - tuple or list with column header names which should be in uploaded file
# serializer - will be used to validate & save each row
# borders_model_field is used in view to find min and max for better user experience
ImporterTemplate = namedtuple('ImporterTemplate', 'fields serializer borders_model_field')
