from django.db import connection
from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse, HttpResponse
from django.urls import reverse
from django.db.models import Q
from .models import Product, Stock, StockHistory, Consumption, ConsoHistory, Alert, Batch, Order, Shortcut
from .serializers import ProductSerializer, StockSerializer, StockHistorySerializer, ConsumptionSerializer, ConsoHistorySerializer, AlertSerializer, BatchSerializer, OrderSerializer
from .forms import ProductForm
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Image, Paragraph, PageBreak
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.enums import TA_CENTER
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.charts.barcharts import VerticalBarChart
import json
from rest_framework import viewsets
import requests
from django.db import models


## INTERNAL FRONT END

def dashboard(request):
    return render(request, 'dashboard.html')

def product_list(request):
    search_query = request.GET.get('search', '')
    sort_by = request.GET.get('sort', '')
    sort_order = request.GET.get('order', 'asc')

    products = Product.objects.all()

    if search_query:
        products = products.filter(Q(name__icontains=search_query))

    if sort_by:
        if sort_by == 'count':
            sort_field = 'stock__count'
        else:
            sort_field = sort_by

        if sort_order == 'desc':
            sort_field = '-' + sort_field

        products = products.order_by(sort_field)

    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        results = [
            {
                'id': product.id,
                'name': product.name,
                'reference': product.reference,
                'user_name': product.user_name,
                'abbreviated_user_name': product.abbreviated_user_name,
                'description': product.description,
                'order_link': product.order_link,
                'stock_count': product.stock.count if hasattr(product, 'stock') else 0
            }
            for product in products
        ]
        return JsonResponse(results, safe=False)

    context = {
        'products': products,
        'search_query': search_query,
        'sort_by': sort_by,
        'sort_order': sort_order,
        'next_sort_order': 'desc' if sort_order == 'asc' else 'asc'
    }

    return render(request, 'product_list.html', context)

# Add the product_detail view
def product_detail(request, pk):
    product = get_object_or_404(Product, pk=pk)
    form = ProductForm(instance=product)
    count = product.stock.count if hasattr(product, 'stock') else 0
    return render(request, 'product_detail.html', {'form': form, 'count': count, 'product_name': product.name})

def product_add(request):
    if request.method == 'POST':
        if request.headers.get('Content-Type') == 'application/json':
            data = json.loads(request.body)
            form = ProductForm(data)
            if form.is_valid():
                product = form.save()
                Stock.objects.create(product=product, count=data.get('count', 0))
                return JsonResponse({'success': True})
            return JsonResponse({'success': False, 'errors': form.errors})
        else:
            form = ProductForm(request.POST)
            if form.is_valid():
                product = form.save()
                Stock.objects.create(product=product, count=request.POST.get('count', 0))
                return redirect('product_list')
    else:
        form = ProductForm()
    return render(request, 'product_form.html', {'form': form, 'count': ''})

def product_edit(request, pk):
    product = get_object_or_404(Product, pk=pk)
    if request.method == 'POST':
        form = ProductForm(request.POST, instance=product)
        if form.is_valid():
            form.save()
            stock = Stock.objects.get(product=product)
            stock.count = request.POST.get('count', stock.count)
            stock.save()
            return redirect('product_list')
    else:
        form = ProductForm(instance=product)
        count = product.stock.count if hasattr(product, 'stock') else 0
    return render(request, 'product_form.html', {'form': form, 'count': count})


def product_delete(request, pk):
    try:
        product = get_object_or_404(Product, pk=pk)
        search_query = request.GET.get('search', '')
        sort_by = request.GET.get('sort', '')
        sort_order = request.GET.get('order', 'asc')

        if request.method == 'POST':
            product.delete()

            # Check if there are any results left after deletion
            products = Product.objects.all()
            if search_query:
                products = products.filter(Q(name__icontains=search_query))

            # If no results, clear the search query
            if not products.exists():
                search_query = ''

            return redirect(f'{reverse("product_list")}?search={search_query}&sort={sort_by}&order={sort_order}')

        return render(request, 'product_confirm_delete.html', {
            'product': product,
            'search_query': search_query,
            'sort_by': sort_by,
            'sort_order': sort_order
        })
    except Product.DoesNotExist:
        return redirect('product_list')

def product_search(request):
    query = request.GET.get('query', '')
    products = Product.objects.filter(name__icontains=query)
    results = [
        {
            'id': product.id,
            'name': product.name,
            'reference': product.reference,
            'user_name': product.user_name,
            'abbreviated_user_name': product.abbreviated_user_name,
            'description': product.description,
            'order_link': product.order_link,
            'stock_count': product.stock.count if hasattr(product, 'stock') else 0
        }
        for product in products
    ]
    return JsonResponse(results, safe=False)

def graph_page(request):
    return render(request, 'graph_page.html')

def instantaneous_data(request):
    graph_type = request.GET.get('type')
    if graph_type == 'stock':
        data = Stock.objects.all()
    elif graph_type == 'consumption':
        data = Consumption.objects.all()
    else:
        data = []

    labels = [item.product.name for item in data]
    values = [item.count for item in data]

    return JsonResponse({'labels': labels, 'values': values})

def historical_data(request):
    graph_type = request.GET.get('type')
    if graph_type == 'stock':
        data = StockHistory.objects.all().order_by('date')
    elif graph_type == 'consumption':
        data = ConsoHistory.objects.all().order_by('date')
    else:
        data = []

    labels = [item.date.strftime('%Y-%m-%d') for item in data]
    values = [item.count for item in data]

    return JsonResponse({'labels': labels, 'values': values})

def bar_graph(request):
    graph_type = request.GET.get('type')
    if graph_type == 'stock':
        data = Stock.objects.all()
    elif graph_type == 'consumption':
        data = Consumption.objects.all()
    else:
        data = []

    labels = [item.product.name for item in data]
    values = [item.count for item in data]

    context = {
        'labels': labels,
        'values': values,
        'graph_type': graph_type.capitalize()
    }
    return render(request, 'bar_graph.html', context)

def historical_graph(request, model, template_name, display_name):
    histories = model.objects.all().order_by('date')
    min_date = histories.first().date
    max_date = histories.last().date

    context = {
        'histories': histories,
        'min_date': min_date,
        'max_date': max_date,
        'display_name': display_name
    }
    return render(request, template_name, context)

def check_alerts():
    alerts = Alert.objects.filter(active=True)
    triggered_alerts = []

    for alert in alerts:
        stock = Stock.objects.get(product=alert.product)
        if (alert.threshold_low is not None and stock.count < alert.threshold_low) or \
           (alert.threshold_high is not None and stock.count > alert.threshold_high):
            triggered_alerts.append({
                'product': alert.product.name,
                'stock': stock.count,
                'threshold_low': alert.threshold_low,
                'threshold_high': alert.threshold_high
            })

    return triggered_alerts

def alert_table(request):
    triggered_alerts = check_alerts()
    context = {
        'triggered_alerts': triggered_alerts,
    }
    return render(request, 'alert_table.html', context)

def generate_pdf_stock(request):
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="stock.pdf"'

    buffer = BytesIO()
    p = SimpleDocTemplate(buffer, pagesize=letter)
    elements = []

    logo_path = "resources/Logo/1024x1024_full.png"
    logo = Image(logo_path)
    logo_width = 1.5 * inch
    logo_height = (logo.imageHeight / logo.imageWidth) * logo_width
    logo.drawHeight = logo_height
    logo.drawWidth = logo_width
    elements.append(logo)

    style = getSampleStyleSheet()
    title_style = style['Normal']
    title_style.alignment = TA_CENTER
    title_style.fontSize = 20
    title_style.spaceAfter = 20
    elements.append(Paragraph('FAMILINK STOCK', title_style))

    items_per_page = 5
    stocks = Stock.objects.all()
    pages = [stocks[i:i + items_per_page] for i in range(0, len(stocks), items_per_page)]

    for page in pages:
        chart_data = [stock.count for stock in page]
        chart_labels = [stock.product.name for stock in page]
        drawing = Drawing(400, 200)
        chart = VerticalBarChart()
        chart.x = 50
        chart.y = 50
        chart.height = 125
        chart.width = 300
        chart.data = [chart_data]
        chart.categoryAxis.categoryNames = chart_labels
        chart.valueAxis.valueMin = 0
        drawing.add(chart)
        elements.append(drawing)

        table_style = TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ])

        data = [['Product', 'Count']]
        for stock in page:
            data.append([stock.product.name, stock.count])
        t = Table(data, style=table_style)
        elements.append(t)
        elements.append(PageBreak())

    p.build(elements)
    pdf = buffer.getvalue()
    buffer.close()
    response.write(pdf)
    return response

def generate_pdf_conso(request):
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="consumption.pdf"'

    buffer = BytesIO()
    p = SimpleDocTemplate(buffer, pagesize=letter)
    elements = []

    logo_path = "resources/Logo/1024x1024_full.png"
    logo = Image(logo_path)
    logo_width = 1.5 * inch
    logo_height = (logo.imageHeight / logo.imageWidth) * logo_width
    logo.drawHeight = logo_height
    logo.drawWidth = logo_width
    elements.append(logo)

    style = getSampleStyleSheet()
    title_style = style['Normal']
    title_style.alignment = TA_CENTER
    title_style.fontSize = 20
    title_style.spaceAfter = 20
    elements.append(Paragraph('FAMILINK CONSUMPTION', title_style))

    items_per_page = 5
    consumptions = Consumption.objects.all()
    pages = [consumptions[i:i + items_per_page] for i in range(0, len(consumptions), items_per_page)]

    for page in pages:
        chart_data = [consumption.count for consumption in page]
        chart_labels = [consumption.product.name for consumption in page]
        drawing = Drawing(400, 200)
        chart = VerticalBarChart()
        chart.x = 50
        chart.y = 50
        chart.height = 125
        chart.width = 300
        chart.data = [chart_data]
        chart.categoryAxis.categoryNames = chart_labels
        chart.valueAxis.valueMin = 0
        drawing.add(chart)
        elements.append(drawing)

        table_style = TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ])

        data = [['Product', 'Count']]
        for consumption in page:
            data.append([consumption.product.name, consumption.count])
        t = Table(data, style=table_style)
        elements.append(t)

    p.build(elements)
    pdf = buffer.getvalue()
    buffer.close()
    response.write(pdf)
    return response


## EXTERNAL FRONT END

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class StockViewSet(viewsets.ModelViewSet):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer

class StockHistoryViewSet(viewsets.ModelViewSet):
    queryset = StockHistory.objects.all()
    serializer_class = StockHistorySerializer

class ConsumptionViewSet(viewsets.ModelViewSet):
    queryset = Consumption.objects.all()
    serializer_class = ConsumptionSerializer

class ConsoHistoryViewSet(viewsets.ModelViewSet):
    queryset = ConsoHistory.objects.all()
    serializer_class = ConsoHistorySerializer

class AlertViewSet(viewsets.ModelViewSet):
    queryset = Alert.objects.all()
    serializer_class = AlertSerializer

class BatchViewSet(viewsets.ModelViewSet):
    queryset = Batch.objects.all()
    serializer_class = BatchSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

def list_stock_and_product_names(request):
    stocks = Stock.objects.select_related('product').all()
    results = [{'product_name': stock.product.name, 'stock_count': stock.count, 'pending_count': stock.pending_count} for stock in stocks]
    return JsonResponse(results, safe=False)



#View Shortcut

from django.apps import apps
from django.views.decorators.csrf import csrf_exempt


def get_column_type(request):
    if request.method == 'GET':
        table_name = request.GET.get('table_name')
        column_name = request.GET.get('column_name')

        if table_name and column_name:
            model = get_model_from_table_name(table_name)
            if model:
                try:
                    field = model._meta.get_field(column_name)
                    column_type = field.get_internal_type()
                    return JsonResponse({'column_type': column_type})
                except Exception as e:
                    return JsonResponse({'error': str(e)}, status=400)
            else:
                return JsonResponse({'error': 'Model not found'}, status=404)

    return JsonResponse({'error': 'Invalid request'}, status=400)



def get_table_list(request):
    if request.method == 'GET':
        tables = connection.introspection.table_names()
        filtered_tables = [table for table in tables if table.startswith("panel")]
        return JsonResponse({'tables': filtered_tables})
    return JsonResponse({'error': 'Invalid request'}, status=400)



def get_column_list(request):
    if request.method == 'GET':
        table_name = request.GET.get('table_name')

        if table_name:
            model = get_model_from_table_name(table_name)
            if model:
                columns = []
                for field in model._meta.get_fields():
                    if not isinstance(field, models.CharField) and field.name != 'id':
                        columns.append(field.name)
                return JsonResponse({'columns': columns})
            else:
                return JsonResponse({'error': f'No model found for table {table_name}'}, status=400)
        else:
            return JsonResponse({'error': 'Missing table_name parameter'}, status=400)
    return JsonResponse({'error': 'Invalid request'}, status=400)

def fetch_column_type(table_name, column_name):
    try:
        response = requests.get(f'http://localhost:8000/panel/get_column_type/?table_name={table_name}&column_name={column_name}')
        if response.status_code == 200:
            return response.json()
        return {'error': 'Failed to fetch column type', 'status_code': response.status_code}
    except requests.exceptions.RequestException as e:
        return {'error': str(e)}


def get_model_from_table_name(table_name):
    # Supprimer le préfixe 'panel_' si présent
    if table_name.startswith('panel_'):
        table_name = table_name[len('panel_'):]

    # Convertir le nom de la table en nom de modèle (majuscule sur la première lettre)
    model_name = ''.join(word.capitalize() for word in table_name.split('_'))

    for app_config in apps.get_app_configs():
        try:
            return app_config.get_model(model_name)
        except LookupError:
            continue
    return None


@csrf_exempt
def create_shortcut(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name')
            action_type = data.get('action_type')
            action_value = data.get('action_value')
            target_table = data.get('target_table')
            target_column = data.get('target_column')
            target_line = data.get('target_line')

            shortcut = Shortcut(
                name=name,
                action_type=action_type,
                action_value=action_value,
                target_table=target_table,
                target_column=target_column,
                target_line=target_line
            )
            shortcut.save()

            return JsonResponse({'status': 'success', 'message': 'Shortcut created successfully'}, status=201)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)


def get_rows(request):
    table_name = request.GET.get('table_name')
    column_name = request.GET.get('column_name')

    if not table_name or not column_name:
        return JsonResponse({'error': 'Missing table name or column name'}, status=400)

    model = get_model_from_table_name(table_name)

    if model:
        try:
            # Vérifier si la colonne existe dans le modèle
            model._meta.get_field(column_name)
        except FieldDoesNotExist:
            return JsonResponse({'error': 'Invalid column name'}, status=400)

        rows = model.objects.all().values_list(column_name, flat=True)
        return JsonResponse({'rows': list(rows)}, safe=False)
    return JsonResponse({'error': 'Invalid table name'}, status=400)

