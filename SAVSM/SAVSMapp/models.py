from django.db import models
from django.utils import timezone
from django.db.models import Sum


class Object(models.Model):
    id_Object = models.AutoField(primary_key=True)
    name = models.CharField(max_length=25, unique=True)
    description = models.CharField(max_length=500, default="No description")

    def __str__(self):
        return f"{self.name} - {self.description}"

    class Meta:
        verbose_name = "Object"
        verbose_name_plural = "Object"


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

    class Meta:
        verbose_name = "BatchStock"
        verbose_name_plural = "BatchStock"


class BatchStockObject(models.Model):
    batch_stock = models.ForeignKey(BatchStock, on_delete=models.CASCADE)
    object = models.ForeignKey(Object, on_delete=models.CASCADE, unique=True)
    count = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.batch_stock} - {self.object} ({self.count})"

    class Meta:
        verbose_name = "BatchStockObject"
        verbose_name_plural = "BatchStockObject"


class SAVStock(models.Model):
    id_SAVStock = models.AutoField(primary_key=True)
    id_object = models.OneToOneField(Object, on_delete=models.CASCADE, unique=True)
    stock_Count = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.id_object.name if self.id_object else 'No Object', str(self.stock_Count)}"

    class Meta:
        verbose_name = "SAVStock"
        verbose_name_plural = "SAVStock"


class SAVConso(models.Model):
    id_SAVConso = models.AutoField(primary_key=True)
    id_object = models.ForeignKey(Object, on_delete=models.CASCADE)
    conso_Count = models.IntegerField(default=0)
    date = models.DateField(default=timezone.now())

    def __str__(self):
        return f"{self.id_object.name if self.id_object else 'No Object'}, {self.conso_Count}, {self.date}"

    def __init__(self, *args, **kwargs):
        super(SAVConso, self).__init__(*args, **kwargs)
        self._conso_Count = self.conso_Count

    class Meta:
        verbose_name = "SAVConso"
        verbose_name_plural = "SAVConso"


class ConsoHistory(models.Model):
    id_ConsoHistory = models.AutoField(primary_key=True)
    date_Conso_History = models.DateField(default=timezone.now)

    def update_counts(self):
        conso_objects = ConsoHistoryObject.objects.filter(conso_history=self)
        object_counts = {obj.id: obj.count for obj in conso_objects}
        for obj_id, count in object_counts.items():
            setattr(self, f"count_{obj_id}", count)
        self.save()

    def __str__(self):
        object_counts = ', '.join([f"{field.name}: {getattr(self, field.name)}" for field in self._meta.fields if field.name.startswith('count_')])
        return f"ConsoHistory {self.id_ConsoHistory} - Date: {self.date_Conso_History}, Counts: {object_counts}"

    class Meta:
        verbose_name = "ConsoHistory"
        verbose_name_plural = "ConsoHistory"



class ConsoHistoryObject(models.Model):
    conso_history = models.ForeignKey('ConsoHistory', on_delete=models.CASCADE)
    object = models.ForeignKey('Object', on_delete=models.CASCADE)
    count = models.IntegerField(default=0)

    def save(self, *args, **kwargs):
        # Calculate the total count for this object from SAVConso
        total_count = SAVConso.objects.filter(id_object=self.object).aggregate(total=Sum('conso_Count'))['total']
        if total_count is not None:
            self.count = total_count
        else:
            self.count = 0
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.object.name} ({self.count})"

    class Meta:
        verbose_name = "ConsoHistoryObject"
        verbose_name_plural = "ConsoHistoryObjects"






#def signals (permet d'automatiser certaines choses sur les models)
from django.dispatch import receiver
from django.db.models.signals import post_save


@receiver(post_save, sender=SAVConso)
def update_SAVStock(sender, instance, created, **kwargs):
        try:
            increment_amount = instance.conso_Count
            sav_stock = SAVStock.objects.get(id_object=instance.id_object)
            print(increment_amount)
            sav_stock.stock_Count -= increment_amount
            sav_stock.save()
        except SAVStock.DoesNotExist:
            print("Je n'ai rien fait")
            pass


@receiver(post_save, sender=Object)
def create_sav_stock_entry(sender, instance, created, **kwargs):
    if created:
        # Créer une nouvelle entrée dans SAVStock avec le nouvel objet
        SAVStock.objects.create(id_object=instance, stock_Count=0)