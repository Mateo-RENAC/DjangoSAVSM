# Generated by Django 4.2.11 on 2024-05-07 13:52

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('SAVSMapp', '0032_alter_savconso_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='savconso',
            name='date',
            field=models.DateField(default=datetime.datetime(2024, 5, 7, 13, 52, 59, 725930, tzinfo=datetime.timezone.utc)),
        ),
    ]
