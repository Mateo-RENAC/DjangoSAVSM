from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('panel/', include('panel.urls')),
    path('', admin.site.urls)
]