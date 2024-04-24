from django.contrib import admin
from .models import Object, SAVConso, BatchStock, ConsoHistory, SAVStock



# Register your models here.
admin.site.register(SAVConso)

admin.site.register(SAVStock)

admin.site.register(BatchStock)

admin.site.register(ConsoHistory)

admin.site.register(Object)