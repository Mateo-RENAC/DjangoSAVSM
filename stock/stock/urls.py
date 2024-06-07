# urls
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('panel/', include('panel.urls')), # Ensure this line is included
    path('', admin.site.urls),
]