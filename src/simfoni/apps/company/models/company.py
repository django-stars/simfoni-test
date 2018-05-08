from django.db import models
from django.utils.translation import ugettext_lazy as _

from core.models import AbstractBaseModel


class Company(AbstractBaseModel):
    """ Contain suppliers. Uploaded data would be cleaned and associated with this records """
    name = models.CharField(_('Company name'), max_length=255, unique=True)
