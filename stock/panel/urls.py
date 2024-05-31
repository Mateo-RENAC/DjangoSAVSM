from django.urls import path
from .views import (
    dashboard, product_list, product_add, product_edit, product_delete, product_detail,
    bar_graph, historical_graph, generate_pdf_stock, generate_pdf_conso, alert_table, product_search, graph_page, instantaneous_data, historical_data
)
from .models import StockHistory, ConsoHistory
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, StockViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'stock', StockViewSet)

urlpatterns = [
    path('', dashboard, name='dashboard'),
    path('products/', product_list, name='product_list'),
    path('products/add/', product_add, name='product_add'),
    path('products/edit/<int:pk>/', product_edit, name='product_edit'),
    path('products/detail/<int:pk>/', product_detail, name='product_detail'),
    path('product-search/', product_search, name='product_search'),
    path('products/delete/<int:pk>/', product_delete, name='product_delete'),
    path('graph/bar/', bar_graph, name='bar_graph'),
    path('graph/historical/', historical_graph, name='historical_graph'),
    path('graph/consumption/history/', historical_graph, {'model': ConsoHistory, 'template_name': 'historical_chart.html', 'display_name': 'Consumption History'}, name='consumption_history_chart'),
    path('graph/stock/history/', historical_graph, {'model': StockHistory, 'template_name': 'historical_chart.html', 'display_name': 'Stock History'}, name='stock_history_chart'),
    path('pdf/stock/', generate_pdf_stock, name='generate_pdf_stock'),
    path('pdf/conso/', generate_pdf_conso, name='generate_pdf_conso'),
    path('alerts/', alert_table, name='alert_table'),
    path('graphs/', graph_page, name='graph_page'),
    path('instantaneous-data/', instantaneous_data, name='instantaneous_data'),
    path('historical-data/', historical_data, name='historical_data'),
    path('api/', include(router.urls)),
]