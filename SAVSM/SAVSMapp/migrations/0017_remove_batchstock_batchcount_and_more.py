# Generated by Django 4.2.11 on 2024-04-24 12:50

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('SAVSMapp', '0016_remove_consohistory_id_object_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='batchstock',
            name='BatchCount',
        ),
        migrations.RemoveField(
            model_name='batchstock',
            name='id_object',
        ),
        migrations.CreateModel(
            name='BatchStockObject',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('count', models.IntegerField(default=0)),
                ('batch_stock', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='SAVSMapp.batchstock')),
                ('object', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='SAVSMapp.object')),
            ],
        ),
        migrations.AddField(
            model_name='batchstock',
            name='objects',
            field=models.ManyToManyField(through='SAVSMapp.BatchStockObject', to='SAVSMapp.object'),
        ),
    ]
