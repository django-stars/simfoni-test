from django.contrib import admin

from company.models import Company, RawCompany, Match


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', )


@admin.register(RawCompany)
class RawCompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'cleaned_name', )


@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ('company', 'raw_company', 'score', 'is_accepted', )
