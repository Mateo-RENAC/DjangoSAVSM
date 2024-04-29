from django.db import models
from django.utils import timezone


class Object(models.Model):
    id_Object = models.AutoField(primary_key=True)
    name = models.CharField(max_length=25, unique=True)
    description = models.CharField(max_length=500, default="No description")

    def __str__(self):
        return f"{self.name} - {self.description}"


class BatchStock(models.Model):
    id_BatchStock = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, null=True, unique=True)
    objects = models.ManyToManyField(Object, through='BatchStockObject')  # Utilisation de through pour spécifier le modèle intermédiaire
    date = models.DateField(default=timezone.now)

    def __str__(self):
        object_counts = ", ".join(
            [f"{batch_stock_object.object.name} ({batch_stock_object.count})" for batch_stock_object in
             self.batchstockobject_set.all()])
        return f"{self.name}: {object_counts}"


class BatchStockObject(models.Model):
    batch_stock = models.ForeignKey(BatchStock, on_delete=models.CASCADE)
    object = models.ForeignKey(Object, on_delete=models.CASCADE, unique=True)
    count = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.batch_stock} - {self.object} ({self.count})"


class SAVStock(models.Model):
    id_SAVStock = models.AutoField(primary_key=True)
    id_object = models.OneToOneField(Object, on_delete=models.CASCADE, unique=True)
    stock_Count = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.id_object.name if self.id_object else 'No Object', str(self.stock_Count)}"


class SAVConso(models.Model):
    id_SAVConso = models.AutoField(primary_key=True)
    id_object = models.ForeignKey(Object, on_delete=models.CASCADE, unique=True)
    conso_Count = models.IntegerField(default=0)
    Batch = models.ForeignKey(BatchStock, on_delete=models.CASCADE, null=True, db_column='id_BatchStock', unique=True)  # Spécifier le nom de la colonne en base de données

    def __str__(self):
        batch_date = self.Batch.date if self.Batch else 'No Batch'  # Accéder à la date de l'objet BatchStock
        return f"{self.id_object.name if self.id_object else 'No Object'}, {self.conso_Count}, {batch_date}"


class ConsoHistory(models.Model):
    id_ConsoHistory = models.AutoField(primary_key=True)
    objects = models.ManyToManyField(Object, through='ConsoHistoryObject')
    date_Conso_History = models.DateField(default=timezone.now)

    def __str__(self):
        object_counts = ", ".join(
            [f"{conso_history_object.object.name} ({conso_history_object.count})" for conso_history_object in
             self.consohistoryobject_set.all()])
        return f"ConsoHistory {self.id_ConsoHistory}: {object_counts}"


class ConsoHistoryObject(models.Model):
    conso_history = models.ForeignKey(ConsoHistory, on_delete=models.CASCADE)
    object = models.ForeignKey(Object, on_delete=models.CASCADE, unique=True)
    count = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.conso_history} - {self.object} ({self.count})"
