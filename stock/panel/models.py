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
    date = models.DateField(default=timezone.now())                                                                     #I have forgot why this date is here ?

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
from django.db.models.signals import post_save, pre_save


@receiver(pre_save, sender=SAVConso)
def update_SAVStock(sender, instance, **kwargs):
    new_amount = instance.conso_Count  # This is the amount being saved now
    variation_amount = new_amount  # Default to new_amount for new records
    if instance.id_SAVConso:
        # The object exists, we are updating it
        try:
            last_object = SAVConso.objects.get(id_SAVConso=instance.id_SAVConso)
            last_amount = last_object.conso_Count
            variation_amount = new_amount - last_amount  # Calculate the difference
        except SAVConso.DoesNotExist:
            # Log this as a critical error; should never happen since instance.id is present
            print("Critical error: Object exists but could not be retrieved.")
    # Apply the variation to the related stock
    try:
        sav_stock = SAVStock.objects.get(id_object=instance.id_object)
        sav_stock.stock_Count -= variation_amount
        sav_stock.save()
    except SAVStock.DoesNotExist:
        # Handle the case where the corresponding stock doesn't exist
        print("Stock record does not exist, cannot update stock.")


@receiver(post_save, sender=Object)
def create_sav_stock_entry(sender, instance, created, **kwargs):
    if created:
        # Créer une nouvelle entrée dans SAVStock avec le nouvel objet
        SAVStock.objects.create(id_object=instance, stock_Count=0)


@receiver(post_save, sender=Object)
def create_sav_conso_entry(sender, instance, created, **kwargs):
    if created:
        # Créer une nouvelle entrée dans SAVConso avec le nouvel objet
        SAVConso.objects.create(id_object=instance, conso_Count=0)



@receiver(post_save, sender=BatchStock)
def create_BatchStock_and_BatchStockObject_entry(sender, instance, created, **kwargs):
    if created:
        # Obtenez tous les objets disponibles
        objects = Object.objects.all()
        # Pour chaque objet, créez une entrée BatchStockObject avec count initial à 0
        for obj in objects:
            BatchStockObject.objects.create(batch_stock=instance, object=obj, count=0)


@receiver(pre_save, sender=BatchStockObject)
def update_previous_count(sender, instance, **kwargs):                                                                  #Ce signal est bien une abérration mais on en a besoin car les objets
    # Récupérer l'instance existante depuis la base de données                                                          #dans un BatchStock sont directement considéré comme étant présent 0x
    if instance.pk:
        instance._original_instance = sender.objects.get(pk=instance.pk)


@receiver(post_save, sender=BatchStockObject)
def update_SAVStock(sender, instance, created, **kwargs):
    if created:
        # Obtenir l'entrée correspondante dans SAVStock pour cet objet
        try:
            sav_stock = SAVStock.objects.get(id_object=instance.object)
        except SAVStock.DoesNotExist:
            # Si l'entrée correspondante n'existe pas, créez-la
            sav_stock = SAVStock.objects.create(id_object=instance.object, stock_Count=0)

        # Ajouter le count du BatchStockObject au stock_Count de SAVStock
        sav_stock.stock_Count += instance.count
        sav_stock.save()
    else:
        # Si le BatchStockObject existant est modifié, ajustez le stock_Count en conséquence
        try:
            sav_stock = SAVStock.objects.get(id_object=instance.object)
            # Obtenez la valeur précédente du count avant la modification
            previous_count = instance._original_instance.count
            # Calculer la variation de stock
            variation_amount = instance.count - previous_count
            sav_stock.stock_Count += variation_amount
            sav_stock.save()
        except SAVStock.DoesNotExist:
            # Gérer le cas où l'entrée correspondante n'existe pas
            print("Stock record does not exist, cannot update stock.")

