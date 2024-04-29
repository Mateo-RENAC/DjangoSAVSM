from django.contrib import admin
from django.contrib.admin import AdminSite
from .models import BatchStockObject, Object, ConsoHistoryObject
from .models import BatchStock, ConsoHistory, SAVStock, SAVConso

admin.site.register(BatchStockObject)
admin.site.register(Object)
admin.site.register(ConsoHistoryObject)

admin.site.register(BatchStock)


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
    list_display = ('object_name', 'conso_Count', 'batch_date')  # Champs à afficher dans la liste
    list_filter = ('Batch__date',)  # Filtre par date de batch
    search_fields = ('id_object__name',)  # Champ de recherche par nom d'objet

    def object_name(self, obj):
        return obj.id_object.name  # Champ personnalisé pour le nom de l'objet dans l'admin
    object_name.short_description = 'Name'  # Titre du champ dans l'admin

    def batch_date(self, obj):
        return obj.Batch.date if obj.Batch else 'No Batch'  # Champ personnalisé pour la date de batch dans l'admin
    batch_date.short_description = 'Date'  # Titre du champ dans l'admin


admin.site.register(SAVConso, SAVConsoAdmin)


class ConsoHistoryAdmin(admin.ModelAdmin):
    list_display = ('object_counts', 'date_Conso_History')  # Champs à afficher dans la liste

    def object_counts(self, obj):
        return ", ".join([f"{conso_history_object.object.name} ({conso_history_object.count})" for conso_history_object in obj.consohistoryobject_set.all()])  # Champ personnalisé pour les objets et leurs quantités dans l'admin
    object_counts.short_description = 'Objects and Counts'  # Titre du champ dans l'admin


admin.site.register(ConsoHistory, ConsoHistoryAdmin)
