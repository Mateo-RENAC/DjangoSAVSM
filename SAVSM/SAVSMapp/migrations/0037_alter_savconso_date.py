# Generated by Django 4.2.11 on 2024-05-17 11:05

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('SAVSMapp', '0036_alter_savconso_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='savconso',
            name='date',
            field=models.DateField(default=datetime.datetime(2024, 5, 17, 11, 5, 50, 354597, tzinfo=datetime.timezone.utc)),
        ),
    ]
