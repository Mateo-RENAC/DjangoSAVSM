# Generated by Django 4.2.11 on 2024-04-22 14:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('SAVSMapp', '0005_batchstock_consohistory'),
    ]

    operations = [
        migrations.AddField(
            model_name='consohistory',
            name='conso',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='SAVSMapp.savconso'),
        ),
        migrations.AddField(
            model_name='consohistory',
            name='stock',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='SAVSMapp.savstock'),
        ),
    ]
