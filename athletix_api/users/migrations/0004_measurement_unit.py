# Generated by Django 5.1.4 on 2025-01-05 06:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_profile_measurements'),
    ]

    operations = [
        migrations.AddField(
            model_name='measurement',
            name='unit',
            field=models.CharField(blank=True, max_length=5),
        ),
    ]
