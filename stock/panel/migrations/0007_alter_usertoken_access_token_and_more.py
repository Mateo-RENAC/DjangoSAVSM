# Generated by Django 4.2.11 on 2024-06-07 10:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('panel', '0006_usertoken'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usertoken',
            name='access_token',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='usertoken',
            name='refresh_token',
            field=models.TextField(blank=True, null=True),
        ),
    ]