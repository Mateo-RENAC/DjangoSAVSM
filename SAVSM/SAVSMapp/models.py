from django.db import models
from django.utils import timezone


class Object(models.Model):
    id_Object = models.AutoField(primary_key=True)
    name = models.CharField(max_length=25)
    description = models.CharField(max_length=500, default="No description")

    def __str__(self):
        return f"{self.name} - {self.description}"


class BatchStock(models.Model):
    id_BatchStock = models.AutoField(primary_key=True)
    id_object = models.ManyToManyField(Object)
    BatchCount = models.IntegerField(default=0)
    date = models.DateField(default=timezone.now)

    def __str__(self):
        return f"{', '.join(obj.name for obj in self.id_object.all()),str(self.BatchCount)}"


class SAVStock(models.Model):
    id_SAVStock = models.AutoField(primary_key=True)
    id_object = models.OneToOneField(Object, on_delete=models.CASCADE)
    stock_Count = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.id_object.name if self.id_object else 'No Object', str(self.stock_Count)}"


class SAVConso(models.Model):
    id_SAVConso = models.AutoField(primary_key=True)
    id_object = models.ForeignKey(Object, on_delete=models.CASCADE)
    conso_Count = models.IntegerField(default=0)
    date_Precedent_Batch = models.ForeignKey(BatchStock, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return f"{self.id_object.name if self.id_object else 'No Object', self.conso_Count, self.date_Precedent_Batch}"


class ConsoHistory(models.Model):
    id_ConsoHistory = models.AutoField(primary_key=True)
    id_object = models.ManyToManyField(SAVConso)
    count_Conso = models.IntegerField(default=0)
    date_Conso_History = models.DateField(default=timezone.now)

    def __str__(self):
        return f"{self.id_object.name if self.id_object else 'No Object', self.count_Conso, self.date_Conso_History}"
