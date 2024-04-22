from django.db import models
from django.utils import timezone


class SAVStock(models.Model) :
    id_Stock = models.AutoField(primary_key=True)
    name = models.CharField(max_length = 25)
    count = models.IntegerField(default = 0)

    def __str__(self):
        return self.name


class SAVConso (models.Model) :
    stock = models.ForeignKey(SAVStock, on_delete=models.CASCADE)
    count = models.IntegerField(default = 0)
    date_Precedent_batch = models.DateField(default = timezone.now)

    def __str__(self):
        return self.stock.name



# Create your models here.
