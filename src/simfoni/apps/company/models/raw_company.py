from django.db import models
from django.utils.translation import ugettext_lazy as _

from core.models import AbstractBaseModel


class RawCompany(AbstractBaseModel):
    """ Data which should be processed to obtain Company """
    name = models.CharField(_('Raw company name'), max_length=255)
    cleaned_name = models.CharField(_('Cleaned raw company name'), max_length=255)

    def __str__(self):
        return ''.join((self.name, ' (', self.cleaned_name, ')'))
