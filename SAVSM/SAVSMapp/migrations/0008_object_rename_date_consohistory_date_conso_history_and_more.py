# Generated by Django 4.2.11 on 2024-04-23 14:30

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('SAVSMapp', '0007_rename_stock_consohistory_object_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Object',
            fields=[
                ('id_Object', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=25)),
                ('description', models.CharField(max_length=500, null=True)),
            ],
        ),
        migrations.RenameField(
            model_name='consohistory',
            old_name='date',
            new_name='date_Conso_History',
        ),
        migrations.RenameField(
            model_name='savconso',
            old_name='count',
            new_name='conso_Count',
        ),
        migrations.RenameField(
            model_name='savstock',
            old_name='count',
            new_name='stock_Count',
        ),
        migrations.RemoveField(
            model_name='batchstock',
            name='name',
        ),
        migrations.RemoveField(
            model_name='consohistory',
            name='object',
        ),
        migrations.RemoveField(
            model_name='savconso',
            name='date_Precedent_batch',
        ),
        migrations.RemoveField(
            model_name='savconso',
            name='stock',
        ),
        migrations.RemoveField(
            model_name='savstock',
            name='id_Stock',
        ),
        migrations.AddField(
            model_name='consohistory',
            name='count_Conso',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='savstock',
            name='id',
            field=models.BigAutoField(auto_created=True, default=0, primary_key=True, serialize=False, verbose_name='ID'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='batchstock',
            name='id_object',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='SAVSMapp.object'),
        ),
        migrations.AddField(
            model_name='consohistory',
            name='id_object',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='SAVSMapp.object'),
        ),
        migrations.AddField(
            model_name='savconso',
            name='date_Precedent_Batch',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='SAVSMapp.batchstock'),
        ),
        migrations.AddField(
            model_name='savconso',
            name='id_object',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='SAVSMapp.object'),
        ),
        migrations.AddField(
            model_name='savconso',
            name='name',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='conso_name', to='SAVSMapp.object'),
        ),
        migrations.AddField(
            model_name='savstock',
            name='id_object',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='SAVSMapp.object'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='savstock',
            name='name',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='stock_name', to='SAVSMapp.object'),
        ),
    ]
