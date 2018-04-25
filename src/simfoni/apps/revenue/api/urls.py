from django.urls import path

from revenue.api import views


urlpatterns = [
    path('revenue-groups/', views.RevenueGroupListCreateAPIView.as_view(), name='revenue-group-list'),
    path(
        'revenue-groups/<uuid:pk>/',
        views.RevenueGroupRetrieveUpdateDestroyAPIView.as_view(),
        name='revenue-group-detail'
    ),
    path('revenue/', views.RevenueRetrieveUploadAPIView.as_view(), name='revenue'),

]
