# Generated by Django 5.1.4 on 2025-01-06 05:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("workouts", "0021_alter_exercise_body_part"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="exercise",
            name="estimated_1rm",
        ),
        migrations.RemoveField(
            model_name="exercise",
            name="max_vol",
        ),
        migrations.RemoveField(
            model_name="exercise",
            name="max_weight",
        ),
    ]
