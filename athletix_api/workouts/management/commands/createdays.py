from django.core.management.base import BaseCommand
from workouts.models import Day


class Command(BaseCommand):
    help = "Creates days"

    def handle(self, *args, **options):
        days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
        Day.objects.bulk_create([Day(name=day) for day in days], ignore_conflicts=True)
        self.stdout.write(self.style.SUCCESS("Successfully created days"))
