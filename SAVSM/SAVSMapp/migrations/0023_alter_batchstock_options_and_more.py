# Generated by Django 4.2.11 on 2024-04-26 12:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('SAVSMapp', '0022_alter_batchstock_options_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='batchstock',
            options={},
        ),
        migrations.AlterModelOptions(
            name='batchstockobject',
            options={},
        ),
        migrations.AlterModelOptions(
            name='consohistory',
            options={},
        ),
        migrations.AlterModelOptions(
            name='consohistoryobject',
            options={},
        ),
        migrations.AlterModelOptions(
            name='object',
            options={},
        ),
        migrations.AlterModelOptions(
            name='savconso',
            options={},
        ),
        migrations.AlterModelOptions(
            name='savstock',
            options={},
        ),
        migrations.RemoveField(
            model_name='batchstock',
            name='batchStockName',
        ),
        migrations.RemoveField(
            model_name='savconso',
            name='date_Prece_Batch',
        ),
        migrations.RemoveField(
            model_name='savconso',
            name='id_Batch',
        ),
        migrations.AddField(
            model_name='savconso',
            name='Batch',
            field=models.ForeignKey(db_column='id_BatchStock', null=True, on_delete=django.db.models.deletion.CASCADE, to='SAVSMapp.batchstock'),
        ),
        migrations.AlterField(
            model_name='savconso',
            name='id_object',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='SAVSMapp.object'),
        ),
    ]
