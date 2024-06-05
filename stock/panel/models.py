from django.db import models
from django.utils import timezone

class Product(models.Model):
    name = models.CharField(max_length=50, unique=True)
    reference = models.CharField(max_length=50, blank=True, null=True)
    user_name = models.CharField(max_length=50, blank=True, null=True)
    abbreviated_user_name = models.CharField(max_length=10, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    localization = models.TextField(blank=True, null=True)
    order_link = models.URLField(blank=True, null=True)
    previous_order = models.ForeignKey('Order', on_delete=models.SET_NULL, null=True, blank=True, related_name='previous_orders')

    def __str__(self):
        return self.name

class Stock(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE)
    count = models.IntegerField(default=0)
    pending_count = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.product.name} - {self.count}"

class Consumption(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE)
    count = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.product.name} - {self.count}"

class StockHistory(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    date = models.DateTimeField(default=timezone.now)
    count = models.IntegerField()

    def __str__(self):
        return f"{self.product.name} - {self.date} - {self.count}"

class ConsoHistory(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    date = models.DateTimeField(default=timezone.now)
    count = models.IntegerField()

    def __str__(self):
        return f"{self.product.name} - {self.date} - {self.count}"

class Order(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    date = models.DateTimeField(default=timezone.now)
    batch = models.ForeignKey('Batch', on_delete=models.SET_NULL, null=True, blank=True, related_name='order_batches')

    def __str__(self):
        return f"Order of {self.quantity} {self.product.name} on {self.date}"

class Batch(models.Model):
    name = models.CharField(max_length=50, unique=True)
    date = models.DateTimeField(default=timezone.now)
    orders = models.ManyToManyField(Order, blank=True, related_name='batch_orders')

    def __str__(self):
        return self.name

class Alert(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    threshold_low = models.IntegerField(blank=True, null=True, help_text="Trigger alert if stock is below this value")
    threshold_high = models.IntegerField(blank=True, null=True, help_text="Trigger alert if stock is above this value")
    active = models.BooleanField(default=True, help_text="Is this alert active?")

    def __str__(self):
        return f"Alert for {self.product.name}"

class Shortcut(models.Model):

    ACTIONS_TYPES = [
        ('integer', 'Integer'),
        ('boolean', 'Boolean'),
    ]

    name = models.CharField(max_length=100)
    action_type = models.CharField(max_length=50, choices=ACTIONS_TYPES)
    action_value = models.CharField(max_length=50, null=True, blank=True)
    target_table = models.CharField(max_length=50)
    target_column = models.CharField(max_length=50)

    def __str__(self):
        return self.name
