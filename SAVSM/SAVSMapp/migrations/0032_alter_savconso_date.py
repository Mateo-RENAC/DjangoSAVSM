# Generated by Django 4.2.11 on 2024-05-06 12:25

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('SAVSMapp', '0031_alter_consohistoryobject_options_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='savconso',
            name='date',
            field=models.DateField(default=datetime.datetime(2024, 5, 6, 12, 25, 40, 900515, tzinfo=datetime.timezone.utc)),
        ),
    ]
