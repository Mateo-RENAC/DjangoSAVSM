from django.contrib import admin
from .models import Product, Stock, Consumption, StockHistory, ConsoHistory, Order, Batch, Alert

class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'reference', 'user_name', 'abbreviated_user_name', 'description', 'order_link')
    search_fields = ('name', 'reference', 'user_name')

admin.site.register(Product, ProductAdmin)

class StockAdmin(admin.ModelAdmin):
    list_display = ('product_name', 'count')
    search_fields = ('product__name',)

    def product_name(self, obj):
        return obj.product.name

    product_name.short_description = 'Product'

admin.site.register(Stock, StockAdmin)

class ConsumptionAdmin(admin.ModelAdmin):
    list_display = ('product_name', 'count')
    search_fields = ('product__name',)

    def product_name(self, obj):
        return obj.product.name

    product_name.short_description = 'Product'

admin.site.register(Consumption, ConsumptionAdmin)

class StockHistoryAdmin(admin.ModelAdmin):
    list_display = ('product_name', 'date', 'count')
    list_filter = ('date',)
    search_fields = ('product__name',)

    def product_name(self, obj):
        return obj.product.name

    product_name.short_description = 'Product'

admin.site.register(StockHistory, StockHistoryAdmin)

class ConsoHistoryAdmin(admin.ModelAdmin):
    list_display = ('product_name', 'date', 'count')
    list_filter = ('date',)
    search_fields = ('product__name',)

    def product_name(self, obj):
        return obj.product.name

    product_name.short_description = 'Product'

admin.site.register(ConsoHistory, ConsoHistoryAdmin)

class OrderAdmin(admin.ModelAdmin):
    list_display = ('product_name', 'quantity', 'date', 'batch_name')
    list_filter = ('date',)
    search_fields = ('product__name',)

    def product_name(self, obj):
        return obj.product.name

    product_name.short_description = 'Product'

    def batch_name(self, obj):
        return obj.batch.name if obj.batch else 'No Batch'

    batch_name.short_description = 'Batch'

admin.site.register(Order, OrderAdmin)

class BatchAdmin(admin.ModelAdmin):
    list_display = ('name', 'date', 'orders_list')
    search_fields = ('name',)

    def orders_list(self, obj):
        return ", ".join([f"Order {order.id} - {order.product.name} ({order.quantity})" for order in obj.orders.all()])

    orders_list.short_description = 'Orders'

admin.site.register(Batch, BatchAdmin)

@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display = ('product', 'threshold_low', 'threshold_high', 'active')
    search_fields = ('product__name',)
    list_filter = ('active',)

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        form.base_fields['threshold_low'].required = False
        form.base_fields['threshold_high'].required = False
        return form
