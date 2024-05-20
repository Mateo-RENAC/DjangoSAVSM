from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse, HttpResponse
from django.urls import reverse
from django.db.models import Q
from .models import Product, Stock, Consumption, StockHistory, ConsoHistory, Alert
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
