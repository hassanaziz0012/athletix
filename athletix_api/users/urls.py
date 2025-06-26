from django.urls import path
from . import views

urlpatterns = [
    path('register', views.RegisterUserView.as_view(), name='register'),
    path('login', views.LoginView.as_view(), name='login'),
    path('profile', views.ProfileView.as_view(), name='profile'),
    path('goals', views.GoalsView.as_view(), name='goals'),
    path('measurements', views.MeasurementsView.as_view(), name='measurements'),
    path('measurements/favorites', views.FavoriteMeasurementsView.as_view(), name="favorite-measurements"),
]