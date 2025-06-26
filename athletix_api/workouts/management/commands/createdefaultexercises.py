from django.core.management.base import BaseCommand
from workouts.models import Exercise


class Command(BaseCommand):
    help = "Creates default exercises"

    def handle(self, *args, **options):
        Exercise.create_default_exercises()
        self.stdout.write(self.style.SUCCESS("Successfully created default exercises"))
