from operator import is_
from django.contrib.auth import authenticate
from rest_framework import permissions
from rest_framework import status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from users.serializers import (
    GoalSerializer,
    MeasurementRecordSerializer,
    ProfileSerializer,
    UserSerializer,
    MeasurementSerializer,
)
from users.models import Goal, Measurement, MeasurementRecord, Profile, User


class RegisterUserView(APIView):
    serializer_class = UserSerializer

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.validated_data.pop("password")
            user = serializer.save()
            user.set_password(request.data.get("password"))
            user.save()

            token = Token.objects.get(user=user)

            return Response({"success": True, "token": token.key})

        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        queryset = User.objects.filter(email=email)
        if queryset.exists():
            user = queryset.first()
            authenticated = authenticate(
                request, username=user.username, email=email, password=password
            )
            token = Token.objects.get(user=user)

            if authenticated:
                return Response({"token": token.key})
            else:
                return Response(
                    {"error": "Invalid credentials"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
        else:
            return Response(
                {"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
            )


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request):
        profile = Profile.objects.get(user=request.user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def patch(self, request):
        profile = Profile.objects.get(user=request.user)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True}, status=status.HTTP_201_CREATED)

        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MeasurementsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = Profile.objects.get(user=request.user)
        label = request.query_params.get("label", None)
        if label:
            measurement, _ = profile.measurements.get_or_create(
                label=label, profile=profile
            )
        else:
            measurement = profile.measurements.all()

        serializer = MeasurementSerializer(
            measurement, context={"default_unit": profile.default_unit}
        )
        return Response(serializer.data)

    def post(self, request):
        profile = Profile.objects.get(user=request.user)
        data = request.data
        measurement, _ = Measurement.objects.get_or_create(
            label=data["label"], profile=profile
        )
        data["measurement"] = measurement.pk
        serializer = MeasurementRecordSerializer(data=data)
        if serializer.is_valid():
            record = serializer.save(measurement=measurement)
            record.measurement = measurement
            record.save()

            measurement.records.add(record)

            return Response({"success": True}, status=status.HTTP_201_CREATED)

        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        profile = Profile.objects.get(user=request.user)
        record_id = request.data.get("id")

        try:
            record = MeasurementRecord.objects.get(
                pk=record_id, measurement__profile=profile
            )
            serializer = MeasurementRecordSerializer(
                record, data=request.data, partial=True
            )
            if serializer.is_valid():
                instance = serializer.save()
                return Response({"success": True}, status=status.HTTP_201_CREATED)
        except Measurement.DoesNotExist:
            return Response(
                {"message": "Measurement record not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

    def delete(self, request):
        try:
            profile = Profile.objects.get(user=request.user)
            record_id = request.query_params.get("id")
            record = MeasurementRecord.objects.get(
                pk=record_id, measurement__profile=profile
            )
            record.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Measurement.DoesNotExist:
            return Response(
                {"message": "Measurement record not found"},
                status=status.HTTP_404_NOT_FOUND,
            )


class FavoriteMeasurementsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = Profile.objects.get(user=request.user)
        measurements = profile.measurements.filter(is_favorite=True)
        serializer = MeasurementSerializer(measurements, many=True)
        return Response(serializer.data)

    def post(self, request):
        profile = Profile.objects.get(user=request.user)
        measurement_id = request.data.get("id")
        measurement = Measurement.objects.get(pk=measurement_id, profile=profile)
        measurement.is_favorite = not measurement.is_favorite
        measurement.save()
        return Response({"success": True}, status=status.HTTP_201_CREATED)


class GoalsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = Profile.objects.get(user=request.user)
        goals = Goal.objects.filter(profile=profile)
        serializer = GoalSerializer(goals, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        profile = Profile.objects.get(user=request.user)
        data = request.data
        data["profile"] = profile.pk

        serializer = GoalSerializer(data=data)
        if serializer.is_valid():
            goal = serializer.save(profile=profile)
            return Response({"success": True}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        profile = Profile.objects.get(user=request.user)
        goal_id = request.data.get("goal_id")
        text = request.data.get("text")
        description = request.data.get("description")
        finished = request.data.get("finished")

        try:
            goal = Goal.objects.get(pk=goal_id, profile=profile)
            if text != None:
                goal.text = text

            if description != None:
                goal.description = description

            if finished != None:
                goal.finished = finished

            goal.save()
            return Response({"success": True}, status=status.HTTP_201_CREATED)
        except Goal.DoesNotExist:
            return Response(
                {"error": "Goal not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

    def delete(self, request):
        profile = Profile.objects.get(user=request.user)
        goal_id = request.query_params.get("id")

        if goal_id:
            try:
                goal = Goal.objects.get(pk=goal_id, profile=profile)
                goal.delete()
                return Response({"success": True}, status=status.HTTP_200_OK)
            except Goal.DoesNotExist:
                return Response(
                    {"error": "Goal not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )
        else:
            Goal.objects.filter(profile=profile, finished=True).delete()
            return Response({"success": True}, status=status.HTTP_200_OK)
