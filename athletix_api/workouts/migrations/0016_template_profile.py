# Generated by Django 5.1.4 on 2025-01-03 12:08

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
        ('workouts', '0015_alter_workout_options'),
    ]

    operations = [
        migrations.AddField(
            model_name='template',
            name='profile',
            field=models.ForeignKey(default=4, on_delete=django.db.models.deletion.CASCADE, to='users.profile'),
            preserve_default=False,
        ),
    ]
