# Generated by Django 5.1.4 on 2025-02-15 07:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0009_goal"),
    ]

    operations = [
        migrations.AddField(
            model_name="profile",
            name="use_kg",
            field=models.BooleanField(default=True),
        ),
    ]
