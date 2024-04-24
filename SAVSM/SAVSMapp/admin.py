from django.contrib import admin
from django.contrib.admin import AdminSite
from .models import BatchStockObject, Object, ConsoHistoryObject
from .models import BatchStock, ConsoHistory, SAVStock, SAVConso


# Création d'une classe AdminSite personnalisée
class CustomAdminSite(AdminSite):
    site_header = 'Custom Admin'  # Entête du site personnalisé

# Instanciation de la classe AdminSite personnalisée
custom_admin_site = CustomAdminSite(name='custom_admin')

# Définition de classes ModelAdmin personnalisées pour vos modèles
class BatchStockObjectAdmin(admin.ModelAdmin):
    pass

class ObjectAdmin(admin.ModelAdmin):
    pass

class ConsoHistoryObjectAdmin(admin.ModelAdmin):
    pass

# Enregistrement de vos modèles avec les classes ModelAdmin personnalisées
custom_admin_site.register(BatchStockObject, BatchStockObjectAdmin)
custom_admin_site.register(Object, ObjectAdmin)
custom_admin_site.register(ConsoHistoryObject, ConsoHistoryObjectAdmin)

admin.site.register(BatchStock)
admin.site.register(SAVStock)
admin.site.register(SAVConso)
admin.site.register(ConsoHistory)
