from django.apps import AppConfig
from django.core.signals import setting_changed


class SavsmappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'SAVSMapp'

    def ready(self):
        import signals
        setting_changed.connect(signals.SignalSAVUse)

