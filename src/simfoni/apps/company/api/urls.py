from django.urls import path

from company.api import views


urlpatterns = [
    path('companies/upload/', views.UploadCompaniesAPIView.as_view(), name='companies-upload'),
    path('companies/', views.CompaniesListAPIView.as_view(), name='companies-list'),
    path('companies/<uuid:pk>/matches/', views.CompanyMatchesListAPIView.as_view(), name='company-matches-list'),

    path('matches/<uuid:pk>/', views.MatchUpdateDeleteAPIView.as_view(), name='accept-decline-match'),

    # used for handy testing - flush data from 'company' app models
    path('flush/', views.FlushCompaniesAPIView.as_view(), name='flush-companies'),
]
