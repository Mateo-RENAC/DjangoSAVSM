from django.shortcuts import render
from .models import ConsoHistory, ConsoHistoryObject, Object, SAVStock


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
