from django.contrib import admin
from django.contrib.admin import AdminSite
from .models import BatchStockObject, Object, ConsoHistoryObject
from .models import BatchStock, ConsoHistory, SAVStock, SAVConso


class SAVStockAdmin(admin.ModelAdmin):
    list_display = ('object_name', 'stock_count')
    list_filter = ('id_object__name',)
    search_fields = ('id_object__name',)

    def object_name(self, obj):
        return obj.id_object.name

    object_name.short_description = 'Name'

    def stock_count(self, obj):
        return obj.stock_Count

    stock_count.short_description = 'Count'


admin.site.register(SAVStock, SAVStockAdmin)


class SAVConsoAdmin(admin.ModelAdmin):
    list_display = ('object_name', 'conso_Count', 'date')
    list_filter = ('date',)
    search_fields = ('id_object__name',)

    def object_name(self, obj):
        return obj.id_object.name

    object_name.short_description = 'Name'


admin.site.register(SAVConso, SAVConsoAdmin)


class BatchStockAdmin(admin.ModelAdmin):
    list_display = ('name', 'batchstock_objects', 'date')
    search_fields = ('name',)

    def batchstock_objects(self, obj):
        return ", ".join([f"{batch_stock_object.object.name} ({batch_stock_object.count})" for batch_stock_object in obj.batchstockobject_set.all()])

    batchstock_objects.short_description = 'Objects and Counts'


admin.site.register(BatchStock, BatchStockAdmin)


class ConsoHistoryAdmin(admin.ModelAdmin):
    list_display = ('id_ConsoHistory', 'date_Conso_History', 'object_counts')
    search_fields = ('id_ConsoHistory', 'date_Conso_History')

    def object_counts(self, obj):
        counts = [f"{obj.object.name}: {obj.count}" for obj in obj.consohistoryobject_set.all()]
        return ', '.join(counts)

    object_counts.short_description = 'Objects and Counts'


admin.site.register(ConsoHistory, ConsoHistoryAdmin)


@admin.register(BatchStockObject)
class BatchStockObjectAdmin(admin.ModelAdmin):
    list_display = ('batch_stock', 'object', 'count')
    list_filter = ('batch_stock__date',)
    search_fields = ('object__name',)


@admin.register(Object)
class ObjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')


@admin.register(ConsoHistoryObject)
class ConsoHistoryObjectAdmin(admin.ModelAdmin):
    list_display = ('conso_history', 'object', 'count')
    list_filter = ('conso_history__date_Conso_History',)
    search_fields = ('object__name',)
