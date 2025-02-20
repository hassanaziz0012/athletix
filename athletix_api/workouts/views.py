from datetime import datetime, timedelta
from django.db.models.functions import TruncDate
from django.db.models import Q
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import ListAPIView
from rest_framework import permissions
from rest_framework import status
from workouts.utils import get_repeating_dates
from workouts.serializers import (
    ExerciseHistoricalDataSerializer,
    ExerciseSerializer,
    TemplateListSerializer,
    WorkoutListSerializer,
    WorkoutSerializer,
    TemplateSerializer,
)
from workouts.models import Exercise, Workout, Template
from users.models import Profile


# Create your views here.
class WorkoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = Profile.objects.get(user=request.user)
        workout_id = request.query_params.get("workout_id", None)

        if workout_id:
            workout = Workout.objects.get(pk=workout_id)
            serializer = WorkoutSerializer(
                workout, context={"default_unit": profile.default_unit}
            )
        else:
            workouts = Workout.objects.exclude(performed_date=None).filter(
                profile=profile
            )
            serializer = WorkoutListSerializer(
                workouts, many=True, context={"default_unit": profile.default_unit}
            )

        return Response(serializer.data)

    def post(self, request):
        profile = Profile.objects.get(user=request.user)
        data = request.data
        data["profile"] = profile.pk

        serializer = WorkoutSerializer(data=data)
        if serializer.is_valid():
            workout: Workout = serializer.save()

            save_as_template = data.get("save_as_template")
            if save_as_template:
                template_schedule = data.get("template_schedule")
                template_day = data.get("template_day")

                template_data = data.copy()
                template_data["performed_date"] = None
                serializer = WorkoutSerializer(data=template_data)
                if serializer.is_valid():
                    template_workout = serializer.save()
                    template, _ = Template.objects.get_or_create(
                        profile=template_workout.profile,
                        workout=template_workout,
                        schedule=template_schedule,
                        day=template_day,
                    )
                    template.save()
                else:
                    print("template errors")
                    return Response(
                        serializer.errors, status=status.HTTP_400_BAD_REQUEST
                    )

            return Response({"success": True})

        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        profile = Profile.objects.get(user=request.user)
        data = request.data
        print(data)
        data["profile"] = profile.pk
        workout = Workout.objects.get(pk=data.get("workout_id"))

        serializer = WorkoutSerializer(workout, data=data)
        if serializer.is_valid():
            workout: Workout = serializer.save()

            save_as_template = data.get("save_as_template")
            if save_as_template:
                template_schedule = data.get("template_schedule")
                template_day = data.get("template_day")

                template_data = data.copy()
                template_data["performed_date"] = None
                serializer = WorkoutSerializer(data=template_data)
                if serializer.is_valid():
                    template_workout = serializer.save()
                    template, _ = Template.objects.get_or_create(
                        profile=template_workout.profile,
                        workout=template_workout,
                        schedule=template_schedule,
                        day=template_day,
                    )
                    template.save()
                else:
                    print("template errors")
                    return Response(
                        serializer.errors, status=status.HTTP_400_BAD_REQUEST
                    )

            return Response({"success": True})

        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        try:
            profile = Profile.objects.get(user=request.user)
            workout_id = request.query_params.get("workout_id", None)
            Workout.objects.get(pk=workout_id, profile=profile).delete()
            return Response({"success": True})
        except Workout.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


class HistoryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = Profile.objects.get(user=request.user)
        workouts = (
            Workout.objects.exclude(performed_date=None)
            .filter(profile=profile)
            .annotate(day=TruncDate("performed_date"))
            .order_by("-day")
        )
        result = {
            str(day): WorkoutSerializer(workouts.filter(day=day), many=True).data
            for day in workouts.values_list("day", flat=True).distinct()
        }
        return Response(result)


class UpcomingView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = Profile.objects.get(user=request.user)
        templates = Template.objects.filter(profile=profile)
        week = {
            (datetime.today() + timedelta(days=i)).date().isoformat(): []
            for i in range(0, 7)
        }

        for template in templates:
            days = template.days.all().values_list("name", flat=True)
            repeating_dates = get_repeating_dates(repeat=template.schedule, days=days)

            for date in repeating_dates:
                parsed_date = str(date)

                if parsed_date in week:
                    serializer = TemplateSerializer(template)
                    week[parsed_date].append(serializer.data)

        if any(week.values()):
            return Response(week)
        else:
            return Response([], status=status.HTTP_200_OK)


class TemplateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = Profile.objects.get(user=request.user)
        template_id = request.query_params.get("template_id")

        if template_id:
            template = Template.objects.get(pk=template_id)
            serializer = TemplateSerializer(
                template, context={"default_unit": profile.default_unit}
            )
        else:
            templates = Template.objects.filter(workout__profile=profile)
            serializer = TemplateListSerializer(
                templates, many=True, context={"default_unit": profile.default_unit}
            )

        return Response(serializer.data)

    def post(self, request):
        profile = Profile.objects.get(user=request.user)
        data = request.data
        data["profile"] = profile.pk
        data["workout"]["profile"] = profile.pk

        workout_data = data["workout"].copy()

        serializer = TemplateSerializer(
            data=data, context={"workout_data": workout_data}
        )
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True}, status=status.HTTP_201_CREATED)

        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        profile = Profile.objects.get(user=request.user)
        data = request.data
        template_id = data.get("template_id")

        data["profile"] = profile.pk
        data["workout"]["profile"] = profile.pk
        workout_data = data["workout"].copy()

        template = Template.objects.get(pk=template_id)

        serializer = TemplateSerializer(
            template, data=data, context={"workout_data": workout_data}
        )
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True}, status=status.HTTP_201_CREATED)

        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        try:
            template_id = request.query_params.get("template_id")
            template = Template.objects.get(pk=template_id)
            template.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        except Template.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


class ExerciseView(ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = PageNumberPagination

    def get_paginated_response(self, data):
        return Response(
            {
                "count": self.paginator.page.paginator.count,
                "pages": self.paginator.page.paginator.num_pages,
                "current": self.paginator.page.number,
                "next": self.paginator.get_next_link(),
                "previous": self.paginator.get_previous_link(),
                "results": data,
            }
        )

    def get(self, request):
        profile = Profile.objects.get(user=request.user)
        names_only = request.query_params.get("names")
        search_term = request.query_params.get("search_term", "")
        filters = request.query_params.get("filters", "")

        exercises = Exercise.objects.filter(
            Q(creator=profile) | Q(is_custom=False),
        )

        if search_term != "":
            exercises = exercises.filter(name__icontains=search_term)

        if filters != "":
            exercises = exercises.filter(body_part__in=filters.split(","))

        if names_only == "true":
            return Response(exercises.values_list("name", flat=True))

        else:
            page = self.paginate_queryset(exercises)
            serializer = ExerciseSerializer(
                page,
                many=True,
                context={"profile": profile, "default_unit": profile.default_unit},
            )
            result = serializer.data
            result.sort(
                key=lambda x: x["stats"]["estimated_1rm"]["value"] if x["stats"] else -1,
                reverse=True,
            )
            return self.get_paginated_response(result)
            # return Response(result)

    def post(self, request):
        profile = Profile.objects.get(user=request.user)
        data = request.data
        data["creator"] = profile.pk

        serializer = ExerciseSerializer(data=data)
        if serializer.is_valid():
            exercise = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        profile = Profile.objects.get(user=request.user)
        data = request.data
        data["creator"] = profile.pk

        exercise_id = data.get("id")
        exercise = Exercise.objects.get(creator=profile, pk=exercise_id)

        serializer = ExerciseSerializer(exercise, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        profile = Profile.objects.get(user=request.user)
        exercise_id = request.query_params.get("id")
        exercise = Exercise.objects.get(pk=exercise_id)
        if exercise.is_custom == True and exercise.creator == profile:
            exercise.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class ExerciseHistoricalView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    # action = None

    def get(self, request, format=None):
        profile = Profile.objects.get(user=request.user)
        exercise_id = request.query_params.get("id")
        exercise = Exercise.objects.get(
            Q(creator=profile) | Q(is_custom=False), pk=exercise_id
        )
        serializer = ExerciseHistoricalDataSerializer(
            exercise, context={"default_unit": profile.default_unit}
        )
        return Response(serializer.data)
