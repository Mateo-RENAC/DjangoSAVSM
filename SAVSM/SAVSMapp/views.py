from django.shortcuts import render
from .models import ConsoHistory, ConsoHistoryObject, Object, SAVStock, SAVConso


def chart(request):
    # Récupérer toutes les instances de ConsoHistory
    histories = ConsoHistory.objects.all()

    # Préparer les données pour le graphique
    dates = sorted([history.date_Conso_History.strftime('%Y-%m-%d') for history in histories])

    # Récupérer tous les objets
    objects = Object.objects.all()

    # Créer un dictionnaire pour stocker les comptes pour chaque objet
    counts_per_object = {obj.name: [] for obj in objects}

    # Pour chaque date, obtenir le compte pour chaque objet
    for date in dates:
        for obj in objects:
            getObjects = ConsoHistoryObject.objects.filter(conso_history__date_Conso_History=date, object=obj)          #c'est une liste contenant 1 objet (nom et un count)
            for getObject in getObjects:                                                                                #Ducoup bah je le sort de la liste
                counts_per_object[getObject.object.name].append(getObject.count)


    context = {
        'dates': dates,
        'counts_per_object': counts_per_object,
    }

    return render(request, 'GraphConso.html', context)



from .models import SAVStock

def stock_chart(request):
    # Retrieve all instances of SAVStock
    stocks = SAVStock.objects.all()

    # Extract object names and their corresponding stock counts
    object_names = [stock.id_object.name for stock in stocks]
    stock_counts = [stock.stock_Count for stock in stocks]

    context = {
        'object_names': object_names,
        'stock_counts': stock_counts,
    }

    return render(request, 'GraphStock.html', context)

#Import Reportlab method
from django.http import HttpResponse
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Image, Paragraph
from reportlab.lib import colors
from io import BytesIO
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.styles import getSampleStyleSheet

def generate_pdf_Stock(request):
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="sav_stock.pdf"'

    # Create a PDF object using SimpleDocTemplate for more complex layouts
    buffer = BytesIO()
    p = SimpleDocTemplate(buffer, pagesize=letter)

    # Define a list to hold the PDF elements
    elements = []

    # Add the logo with preserved aspect ratio
    logo_path = "C:\\Users\\mateo\\PycharmProjects\\Django SAV (Storage Management)\\SAVSM\\SAVSMapp\\Logo\\1024x1024_full.png"
    logo = Image(logo_path)
    logo_width = 1.5 * inch
    logo_height = (logo.imageHeight / logo.imageWidth) * logo_width
    logo.drawHeight = logo_height
    logo.drawWidth = logo_width
    elements.append(logo)

    # Add the title 'FAMILINK' with style
    style = getSampleStyleSheet()
    title_style = style['Normal']
    title_style.alignment = TA_CENTER
    title_style.fontSize = 20
    title_style.spaceAfter = 20
    elements.append(Paragraph('FAMILINK SAV STOCK', title_style))

    # Fetch SAVStock data
    sav_stocks = SAVStock.objects.all()

    # Prepare data for a table
    data = [['Name', 'Count']]
    for sav_stock in sav_stocks:
        data.append([sav_stock.id_object, sav_stock.stock_Count])

    # Create a table with style
    table_style = TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ])
    t = Table(data, style=table_style)
    elements.append(t)

    # Build the PDF
    p.build(elements)

    # Get the value of the BytesIO buffer and write it to the response.
    pdf = buffer.getvalue()
    buffer.close()
    response.write(pdf)
    return response


def generate_pdf_Conso(request):
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="sav_conso.pdf"'

    # Create a PDF object using SimpleDocTemplate for more complex layouts
    buffer = BytesIO()
    p = SimpleDocTemplate(buffer, pagesize=letter)

    # Define a list to hold the PDF elements
    elements = []

    # Add the logo with preserved aspect ratio
    logo_path = "C:\\Users\\mateo\\PycharmProjects\\Django SAV (Storage Management)\\SAVSM\\SAVSMapp\\Logo\\1024x1024_full.png"
    logo = Image(logo_path)
    logo_width = 1.5 * inch
    logo_height = (logo.imageHeight / logo.imageWidth) * logo_width
    logo.drawHeight = logo_height
    logo.drawWidth = logo_width
    elements.append(logo)

    # Add the title 'FAMILINK' with style
    style = getSampleStyleSheet()
    title_style = style['Normal']
    title_style.alignment = TA_CENTER
    title_style.fontSize = 20
    title_style.spaceAfter = 20
    elements.append(Paragraph('FAMILINK SAV Conso', title_style))

    # Fetch SAVStock data
    sav_consos = SAVConso.objects.all()

    # Prepare data for a table
    data = [['Name', 'Count']]
    for sav_conso in sav_consos:
        data.append([sav_conso.id_object, sav_conso.conso_Count])

    # Create a table with style
    table_style = TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ])
    t = Table(data, style=table_style)
    elements.append(t)

    # Build the PDF
    p.build(elements)

    # Get the value of the BytesIO buffer and write it to the response.
    pdf = buffer.getvalue()
    buffer.close()
    response.write(pdf)
    return response
