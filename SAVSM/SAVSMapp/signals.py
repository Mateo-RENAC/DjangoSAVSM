from django.db.models.signals import post_save
from django.dispatch import receiver
from SAVSM.SAVSMapp.models import SAVConso, SAVStock


@receiver(post_save, sender=SAVConso)
def SignalSAVUse(sender, instance, **kwargs):
    if kwargs.get('created', True):
        # Ne rien faire si c'est une création
        return

    try:
        # Récupérer l'instance précédente de SAVConso depuis la base de données
        previous_instance = SAVConso.objects.get(pk=instance.pk)
    except SAVConso.DoesNotExist:
        # Gérer le cas où l'instance précédente n'existe pas
        # Vous pouvez choisir de ne rien faire ou de gérer cette situation différemment selon vos besoins
        return

    increment_amount = instance.count - previous_instance.count
    # Obtenir l'instance unique de SAVStock
    SAVStock_instance = SAVStock.objects.first()
    # Décrémenter count dans SAVStock
    SAVStock_instance.count -= increment_amount
    SAVStock_instance.save()
