from django.urls import path
from workouts import views


urlpatterns = [
    path('list', views.WorkoutView.as_view(), name="workouts-list"),
    path('add', views.WorkoutView.as_view(), name="workouts-add"),
    path('edit', views.WorkoutView.as_view(), name="workouts-edit"),
    path('delete', views.WorkoutView.as_view(), name="workouts-delete"),
    path('history', views.HistoryView.as_view(), name="history"),
    path('upcoming', views.UpcomingView.as_view(), name="upcoming"),
    path('templates', views.TemplateView.as_view(), name="templates"),
    path('exercises', views.ExerciseView.as_view(), name="exercises"),
    path('exercises/historical', views.ExerciseHistoricalView.as_view(), name="exercises-historical"), 
]
