from django.db import models
from django.utils.translation import ugettext_lazy as _

from core.models import AbstractBaseModel


class Company(AbstractBaseModel):
    """ Contain suppliers. Uploaded data would be cleaned and associated with this records """
    name = models.CharField(_('Company name'), max_length=255, unique=True)
    is_completed = models.BooleanField(_('Is completed'), default=False)  # we don't show such rows in companies list
    # it means that such company has no related incomplete Matches. Store it here because it's very costly to
    # calc this value in serializer.

    def __str__(self):
        return self.name
