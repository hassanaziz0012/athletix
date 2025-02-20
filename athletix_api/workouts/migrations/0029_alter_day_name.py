# Generated by Django 5.1.4 on 2025-02-16 10:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("workouts", "0028_day_remove_template_day_template_days"),
    ]

    operations = [
        migrations.AlterField(
            model_name="day",
            name="name",
            field=models.CharField(
                blank=True,
                choices=[
                    ("monday", "Monday"),
                    ("tuesday", "Tuesday"),
                    ("wednesday", "Wednesday"),
                    ("thursday", "Thursday"),
                    ("friday", "Friday"),
                    ("saturday", "Saturday"),
                    ("sunday", "Sunday"),
                ],
                max_length=9,
                unique=True,
            ),
        ),
    ]
