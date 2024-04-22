from django.contrib import admin
from .models import SAVStock
from .models import SAVConso
# Register your models here.
admin.site.register(SAVConso)
admin.site.register(SAVStock)