from collections import namedtuple


# Declare structure which will contain info about expected file column names and serializer which will handle rows.
# As we don't need any methods - we don't create a class.
# But it would be very easy to change it, if new logic will appear

ImporterTemplate = namedtuple('ImporterTemplate', 'fields serializer')
