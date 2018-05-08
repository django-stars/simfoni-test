from django.core.validators import MinValueValidator
from django.db import models
from django.utils.translation import ugettext_lazy as _

from core.models import AbstractBaseModel


class Match(AbstractBaseModel):
    """
    Relation between Company & RawCompany.
    Once it's accepted - it will be reused to match a company in new data uploads (by cleaned_name of raw_company)
    """
    score = models.DecimalField(_('Score'), max_digits=5, decimal_places=2, validators=[MinValueValidator(0)])
    company = models.ForeignKey(
        'company.Company',
        verbose_name=_('Company'),
        related_name='matches',
        on_delete=models.CASCADE
    )
    raw_company = models.ForeignKey(
        'company.RawCompany',
        verbose_name=_('Raw company'),
        related_name='matches',
        on_delete=models.CASCADE
    )
    is_accepted = models.BooleanField(_('Is accepted'), default=False)
