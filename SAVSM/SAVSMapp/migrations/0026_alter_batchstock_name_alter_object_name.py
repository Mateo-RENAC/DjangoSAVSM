# Generated by Django 4.2.11 on 2024-04-29 12:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('SAVSMapp', '0025_batchstock_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='batchstock',
            name='name',
            field=models.CharField(max_length=50, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='object',
            name='name',
            field=models.CharField(max_length=25, unique=True),
        ),
    ]
