# Generated by Django 5.1.4 on 2024-12-26 13:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workouts', '0007_settag_set_tags'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='set',
            options={'ordering': ('order',)},
        ),
        migrations.AddField(
            model_name='set',
            name='order',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
    ]
