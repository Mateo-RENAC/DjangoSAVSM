# Generated by Django 4.2.11 on 2024-05-13 08:10

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('SAVSMapp', '0034_alter_savconso_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='savconso',
            name='date',
            field=models.DateField(default=datetime.datetime(2024, 5, 13, 8, 10, 7, 238551, tzinfo=datetime.timezone.utc)),
        ),
    ]