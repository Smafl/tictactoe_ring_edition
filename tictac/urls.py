from django.urls import path
from . import views

# URL configuration
urlpatterns = [
	path('', views.welcome),
	path('find-room/', views.find_room, name='find_room'),
	path('<str:room_name>/', views.run_game, name='run_game')
]
