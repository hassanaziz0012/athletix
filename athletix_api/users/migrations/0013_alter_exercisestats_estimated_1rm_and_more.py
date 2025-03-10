# Generated by Django 5.1.4 on 2025-02-18 10:59

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0012_measurementrecord_value"),
        ("workouts", "0034_rename_weight_unitvalue"),
    ]

    operations = [
        migrations.AlterField(
            model_name="exercisestats",
            name="estimated_1rm",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="exercise_stats_estimated_1rm",
                to="workouts.unitvalue",
            ),
        ),
        migrations.AlterField(
            model_name="exercisestats",
            name="max_vol",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="exercise_stats_max_vol",
                to="workouts.unitvalue",
            ),
        ),
        migrations.AlterField(
            model_name="exercisestats",
            name="max_weight",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="exercise_stats_max_weight",
                to="workouts.unitvalue",
            ),
        ),
    ]
