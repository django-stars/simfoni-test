from django.db import models
from django.core.validators import MinValueValidator
from django.utils.translation import ugettext_lazy as _

from core.models import AbstractBaseModel


class Revenue(AbstractBaseModel):
    customer_name = models.CharField(_('Customer name'), max_length=255)
    revenue = models.DecimalField(_('Revenue'), max_digits=14, decimal_places=2, validators=[MinValueValidator(0)])
