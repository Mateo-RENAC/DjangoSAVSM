from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import *

# API Router
router = DefaultRouter()
router.register(r'product', ProductViewSet)
router.register(r'stock', StockViewSet)
router.register(r'stock-history', StockHistoryViewSet)
router.register(r'consumption', ConsumptionViewSet)
router.register(r'consumption-history', ConsoHistoryViewSet)
router.register(r'alert', AlertViewSet)
router.register(r'batch', BatchViewSet)
router.register(r'order', OrderViewSet)

# Swagger
schema_view = get_schema_view(
    openapi.Info(
        title="API Documentation",
        default_version='v1',
        description="API documentation for all available endpoints",
        terms_of_service="https://www.example.com/terms/",
        contact=openapi.Contact(email="contact@example.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=[permissions.IsAuthenticated],  # Require authentication for accessing Swagger
)

# URLs
urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include(router.urls)),

    # New API Endpoints for Dynamic Tables
    path('api/tables/', ListTablesView.as_view(), name='list_tables'),
    path('api/tables/<str:table_name>/columns/', ListColumnsView.as_view(), name='list_columns'),
    path('api/tables/<str:table_name>/rows/', ListRowsView.as_view(), name='list_rows'),
    path('api/tables/<str:table_name>/columns/<str:column_name>/rows/', ColumnRowsView.as_view(), name='column_row_list'),
    path('api/tables/<str:table_name>/<int:object_id>/', ObjectDetailView.as_view(), name='object_detail'),
    path('api/check-auth/', CheckAuthView.as_view(), name='check_auth'),
    path('api/csrf-token/', csrf_token_view, name='csrf_token'),

    # Swagger
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    re_path(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
