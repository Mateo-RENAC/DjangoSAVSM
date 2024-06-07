import json
from rest_framework import viewsets, filters
from django.views.decorators.csrf import ensure_csrf_cookie
from django.middleware.csrf import get_token
from django.apps import apps
from django.db import connection
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from django.db import models
from panel.serializers import *


@ensure_csrf_cookie
def csrf_token_view(request):
    csrf_token = get_token(request)
    response = JsonResponse({'csrfToken': csrf_token})
    response.set_cookie('csrftoken', csrf_token)
    return response


class CheckAuthView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'detail': 'Authenticated'}, status=200)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]


class StockViewSet(viewsets.ModelViewSet):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer
    permission_classes = [IsAuthenticated]

class StockHistoryViewSet(viewsets.ModelViewSet):
    queryset = StockHistory.objects.all()
    serializer_class = StockHistorySerializer
    permission_classes = [IsAuthenticated]

class ConsumptionViewSet(viewsets.ModelViewSet):
    queryset = Consumption.objects.all()
    serializer_class = ConsumptionSerializer
    permission_classes = [IsAuthenticated]

class ConsoHistoryViewSet(viewsets.ModelViewSet):
    queryset = ConsoHistory.objects.all()
    serializer_class = ConsoHistorySerializer
    permission_classes = [IsAuthenticated]

class AlertViewSet(viewsets.ModelViewSet):
    queryset = Alert.objects.all()
    serializer_class = AlertSerializer
    permission_classes = [IsAuthenticated]

class BatchViewSet(viewsets.ModelViewSet):
    queryset = Batch.objects.all()
    serializer_class = BatchSerializer
    permission_classes = [IsAuthenticated]

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]


def normalize_table_name(name):
    # Normalize to lowercase and handle both table and model names
    name = name.lower()
    app_models = {m._meta.db_table.lower(): m for m in apps.get_app_config('panel').get_models()}
    reverse_app_models = {m._meta.model_name: m._meta.db_table.lower() for m in app_models.values()}

    if name in app_models:
        return name
    elif name in reverse_app_models:
        return reverse_app_models[name]
    else:
        return None


def get_model_by_table_name(table_name):
    normalized_table_name = normalize_table_name(table_name)
    for m in apps.get_models():
        if m._meta.db_table.lower() == normalized_table_name:
            return m
    return None


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 50  # Default limit
    page_size_query_param = 'limit'
    max_page_size = 1000



class ListRowsView(APIView):
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = '__all__'
    search_fields = '__all__'
    pagination_class = StandardResultsSetPagination

    def get(self, request, table_name):
        try:
            normalized_table_name = normalize_table_name(table_name)
            model = get_model_by_table_name(normalized_table_name)
            if not model:
                return Response({"error": "Table not found"}, status=404)

            queryset = model.objects.all()

            # Apply search
            search = request.query_params.get('search')
            if search:
                queryset = self.apply_search_filters(queryset, search, model)

            # Apply ordering
            sort_by = request.query_params.get('ordering')
            if sort_by:
                queryset = queryset.order_by(sort_by)
            else:
                # Apply default ordering to avoid UnorderedObjectListWarning
                default_ordering = model._meta.ordering if model._meta.ordering else ['id']
                queryset = queryset.order_by(*default_ordering)

            # Apply pagination
            paginator = self.pagination_class()
            paginated_queryset = paginator.paginate_queryset(queryset, request)

            # Dynamic serialization
            fields = [field.name for field in model._meta.fields]
            DynamicSerializer = create_dynamic_serializer(model, fields)
            serializer = DynamicSerializer(instance=paginated_queryset, many=True)

            return paginator.get_paginated_response(serializer.data)
        except Exception as e:
            print(f"Error in ListRowsView: {e}")
            return Response({"error": str(e)}, status=500)

    def apply_search_filters(self, queryset, search, model):
        lookup_operators = {
            ':': 'icontains',
            '!': 'icontains',
            '=': 'exact',
            '!=': 'exact',
            '<': 'lt',
            '<=': 'lte',
            '>': 'gt',
            '>=': 'gte'
        }

        def parse_condition(condition):
            for operator in sorted(lookup_operators.keys(), key=len, reverse=True):
                if operator in condition:
                    columns_part, values_part = condition.split(operator, 1)
                    columns = columns_part.split(',') if columns_part else [field.name for field in model._meta.fields]
                    values = values_part.split(',') if values_part else []
                    return columns, values, operator
            return [], [condition], 'icontains'

        conditions = search.split('&&')
        queries = Q()

        for condition in conditions:
            logic_queries = Q()
            sub_conditions = condition.split('||')

            for sub_condition in sub_conditions:
                columns, values, operator = parse_condition(sub_condition)

                if not columns:
                    columns = [field.name for field in model._meta.fields]

                sub_queries = Q()
                for column in columns:
                    if not hasattr(model, column):
                        continue
                    field = model._meta.get_field(column)
                    if isinstance(field, models.ForeignKey) and operator == 'icontains':
                        continue

                    for value in values:
                        if not value:
                            continue
                        if operator in ['!', '!=']:
                            sub_queries &= ~Q(**{f"{column}__{lookup_operators[operator]}": value})
                        elif operator == '=' and ',' in value:
                            sub_queries &= Q(**{f"{column}__in": value.split(',')})
                        else:
                            if operator in ['<', '<=', '>', '>=']:
                                try:
                                    value = float(value)
                                except ValueError:
                                    continue
                            sub_queries &= Q(**{f"{column}__{lookup_operators[operator]}": value})

                logic_queries |= sub_queries

            queries &= logic_queries

        return queryset.filter(queries)


class ListTablesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            tables = [table for table in connection.introspection.table_names() if table.startswith('panel_')]
            return Response({"tables": tables})
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class ListColumnsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, table_name):
        try:
            normalized_table_name = normalize_table_name(table_name)
            if not normalized_table_name or normalized_table_name not in connection.introspection.table_names():
                return Response({"error": "Table not found"}, status=404)

            description = connection.introspection.get_table_description(connection.cursor(), normalized_table_name)
            columns = [{'name': col.name, 'type': col.type_code} for col in description]
            return Response({"columns": columns})
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class ColumnRowsView(APIView):
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination

    def get(self, request, table_name, column_name):
        try:
            normalized_table_name = normalize_table_name(table_name)
            if not normalized_table_name or normalized_table_name not in connection.introspection.table_names():
                return Response({"error": "Table not found"}, status=status.HTTP_404_NOT_FOUND)

            model = apps.get_model('panel', normalized_table_name)
            if not model:
                return Response({"error": "Table not found"}, status=status.HTTP_404_NOT_FOUND)

            queryset = model.objects.values_list(column_name, flat=True)

            # Filtering
            filter_param = request.query_params.get('filter')
            if filter_param:
                filters = Q()
                for column, value in (f.split(':') for f in filter_param.split(',')):
                    filters &= Q(**{f"{column}__icontains": value})
                queryset = queryset.filter(filters)

            # Sorting
            sort_by = request.query_params.get('sort_by')
            sort_order = request.query_params.get('sort_order', 'asc')
            if sort_by:
                if sort_order == 'desc':
                    sort_by = f'-{sort_by}'
                queryset = queryset.order_by(sort_by)

            paginator = self.pagination_class()
            paginated_queryset = paginator.paginate_queryset(queryset, request)
            return paginator.get_paginated_response(list(paginated_queryset))
        except LookupError:
            return Response({"error": "Invalid table or column name"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ObjectDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, table_name, object_id):
        model = get_model_by_table_name(table_name)
        obj = get_object_or_404(model, id=object_id)
        serializer = ProductSerializer(obj)
        return Response(serializer.data)

    def put(self, request, table_name, object_id):
        model = get_model_by_table_name(table_name)
        obj = get_object_or_404(model, id=object_id)
        serializer = ProductSerializer(obj, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, table_name, object_id):
        model = get_model_by_table_name(table_name)
        obj = get_object_or_404(model, id=object_id)
        obj.delete()
        return Response({"success": f"{object_id} in {table_name} has been deleted"}, status=status.HTTP_204_NO_CONTENT)
