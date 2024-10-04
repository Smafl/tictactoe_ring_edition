from django.urls import path
from . import views

# URL configuration
urlpatterns = [
	path('', views.test),
	path('game/', views.run_game)
]
