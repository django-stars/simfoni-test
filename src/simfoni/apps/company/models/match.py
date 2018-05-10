from django.core.validators import MinValueValidator
from django.core.exceptions import ObjectDoesNotExist
from django.db import models
from django.db.models.signals import post_delete
from django.utils.translation import ugettext_lazy as _

from core.models import AbstractBaseModel


class Match(AbstractBaseModel):
    """
    Relation between Company & RawCompany.
    Once it's accepted - it will be reused to match a company in new data uploads (by cleaned_name of raw_company)
    """
    score = models.DecimalField(_('Score'), max_digits=5, decimal_places=2, validators=[MinValueValidator(0)])
    correct_order = models.BooleanField(_('Correct order'), default=True)
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


def remove_companies_without_match(sender, instance, **kwargs):
    try:
        if not instance.company.matches.all().exists():
            instance.company.delete()
    except ObjectDoesNotExist:
        # instance.company could raise exception if there is no company
        pass


post_delete.connect(remove_companies_without_match, sender=Match)
