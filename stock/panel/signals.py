from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import Stock, StockHistory, Consumption, ConsoHistory, Order
from django.utils import timezone
from django.contrib.auth.models import User
from .models import UserToken
from rest_framework_simplejwt.tokens import RefreshToken
import threading

# Thread-local variable to store flags for recursion control
_thread_locals = threading.local()

def set_flag(flag_name, value):
    setattr(_thread_locals, flag_name, value)

def get_flag(flag_name):
    return getattr(_thread_locals, flag_name, False)

@receiver(post_save, sender=Order)
def update_stock_on_order(sender, instance, created, **kwargs):
    if created:
        set_flag('skip_stock_signal', True)
        try:
            stock, created = Stock.objects.get_or_create(product=instance.product)
            stock.pending_count += instance.quantity
            stock.save()
        finally:
            set_flag('skip_stock_signal', False)

@receiver(pre_save, sender=Consumption)
def update_stock_on_consumption(sender, instance, **kwargs):
    if get_flag('skip_consumption_signal'):
        return

    try:
        stock = Stock.objects.get(product=instance.product)
        stock_difference = instance.count - (Consumption.objects.get(product=instance.product).count if instance.pk else 0)
        stock.count -= stock_difference
        set_flag('skip_stock_signal', True)
        stock.save()
    except Stock.DoesNotExist:
        print("Stock record does not exist, cannot update stock.")
    finally:
        set_flag('skip_stock_signal', False)

@receiver(pre_save, sender=Stock)
def update_consumption_on_stock_decrease(sender, instance, **kwargs):
    if get_flag('skip_stock_signal'):
        return

    try:
        previous_stock = Stock.objects.get(pk=instance.pk)
    except Stock.DoesNotExist:
        return

    stock_difference = previous_stock.count - instance.count

    if stock_difference > 0:
        set_flag('skip_consumption_signal', True)
        try:
            consumption, created = Consumption.objects.get_or_create(product=instance.product)
            consumption.count += stock_difference
            consumption.save()
        finally:
            set_flag('skip_consumption_signal', False)

@receiver(post_save, sender=Stock)
def create_stock_history(sender, instance, **kwargs):
    StockHistory.objects.create(product=instance.product, date=timezone.now(), count=instance.count)

@receiver(post_save, sender=Consumption)
def create_conso_history(sender, instance, **kwargs):
    ConsoHistory.objects.create(product=instance.product, date=timezone.now(), count=instance.count)


# For user authentification in frontend
@receiver(post_save, sender=User)
def create_user_token(sender, instance, created, **kwargs):
    if created:
        refresh = RefreshToken.for_user(instance)
        UserToken.objects.create(
            user=instance,
            access_token=str(refresh.access_token),
            refresh_token=str(refresh)
        )

@receiver(post_save, sender=User)
def save_user_token(sender, instance, **kwargs):
    user_token, created = UserToken.objects.get_or_create(user=instance)
    if not created:
        refresh = RefreshToken.for_user(instance)
        user_token.access_token = str(refresh.access_token)
        user_token.refresh_token = str(refresh)
        user_token.save()