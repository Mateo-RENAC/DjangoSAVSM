from django.contrib import admin
from django.contrib.admin import AdminSite
from .models import BatchStockObject, Object, ConsoHistoryObject
from .models import BatchStock, ConsoHistory, SAVStock, SAVConso

admin.site.register(BatchStockObject)
admin.site.register(Object)
admin.site.register(ConsoHistoryObject)

admin.site.register(BatchStock)
admin.site.register(SAVStock)
admin.site.register(SAVConso)
admin.site.register(ConsoHistory)
