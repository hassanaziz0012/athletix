# Generated by Django 5.1.4 on 2025-01-07 07:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("workouts", "0022_remove_exercise_estimated_1rm_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="set",
            name="note",
        ),
        migrations.AddField(
            model_name="workoutexercise",
            name="note",
            field=models.TextField(blank=True),
        ),
    ]
