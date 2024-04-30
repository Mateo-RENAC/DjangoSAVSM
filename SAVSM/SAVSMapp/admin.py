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
    '''
    Admin interface for SAVConso
    '''
    list_display = ('object_name', 'conso_Count', 'batch_date')  # Champs qui s'affiche dans la liste
    list_filter = ('Batch__date',)  # Filtre par date de batch
    search_fields = ('id_object__name',)  # Champ de recherche par nom d'objet

    def object_name(self, obj):
        '''
        Return object name
        :param obj:
        :return: str
        '''
        return obj.id_object.name  # Champ personnalisé pour le nom de l'objet dans l'admin
    object_name.short_description = 'Name'  # Titre du champ dans l'admin

    def batch_date(self, obj):
        '''
        return Batch date
        :param obj:
        :return: date
        '''
        return obj.Batch.date if obj.Batch else 'No Batch'
    batch_date.short_description = 'Date'


admin.site.register(SAVConso, SAVConsoAdmin)


class BatchStockAdmin(admin.ModelAdmin):
    '''
    Admin interface for BatchStock
    '''
    list_display = ('name', 'batchstock_objects', 'date')
    search_fields = ('name',)

    def batchstock_objects(self, obj):
        '''
        Return batchstock objects
        :param obj:
        :return: str
        '''
        return ", ".join([f"{batch_stock_object.object.name} ({batch_stock_object.count})" for batch_stock_object in obj.batchstockobject_set.all()])
    batchstock_objects.short_description = 'Objects and Counts'


admin.site.register(BatchStock, BatchStockAdmin)


class ConsoHistoryAdmin(admin.ModelAdmin):
    '''
    Admin interface for ConsoHistory
    '''
    list_display = ('consohistory_objects', 'date_Conso_History')
    search_fields = ('consohistoryobject__object__name',)

    def consohistory_objects(self, obj):
        '''
        Return consohistory objects
        :param obj:
        :return: str
        '''
        return ", ".join([f"{conso_history_object.object.name} ({conso_history_object.count})" for conso_history_object in obj.consohistoryobject_set.all()])
    consohistory_objects.short_description = 'Objects and Counts'


admin.site.register(ConsoHistory, ConsoHistoryAdmin)



#Object Models
@admin.register(BatchStockObject)
class BatchStockObjectAdmin(admin.ModelAdmin):
    '''
    Admin interface for BatchStockObject
    '''
    list_display = ('batch_stock', 'object', 'count')
    list_filter = ('batch_stock__date',)
    search_fields = ('object__name',)


@admin.register(Object)
class ObjectAdmin(admin.ModelAdmin):
    '''
    Admin interface for Object
    '''
    list_display = ('name', 'description')


@admin.register(ConsoHistoryObject)
class ConsoHistoryObjectAdmin(admin.ModelAdmin):
    '''
    Admin interface for ConsoHistoryObject
    '''
    list_display = ('conso_history', 'object', 'count')
    list_filter = ('conso_history__date_Conso_History',)
    search_fields = ('object__name',)