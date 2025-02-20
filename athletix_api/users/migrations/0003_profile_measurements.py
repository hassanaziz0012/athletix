# Generated by Django 5.1.4 on 2025-01-05 06:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_measurement'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='measurements',
            field=models.ManyToManyField(blank=True, related_name='profile_measurements', to='users.measurement'),
        ),
    ]
