from django.shortcuts import render

from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .models import Room

import logging

# Create your views here.
logger = logging.getLogger(__name__)  # Configure logging

def welcome(request):
	return render(request, 'welcome.html')

def find_room(request):
    if request.method == 'POST':
        try:
            logger.info("Received POST request for finding room.")
            user = request.user  # Get the current logged-in user

            # Check if there's an available room
            room = Room.objects.filter(player2__isnull=True).first()  # Find a room without a second player

            if room:
                # If there is an available room, join it
                room.player2 = user.username  # Store username as player2
                room.save()
                logger.info(f"User {user.username} joined room {room.name}.")
                return JsonResponse({'status': 'joined', 'name': room.name})
            else:
                # If no room is available, create a new one
                name = f'Room-{Room.objects.count() + 1}'  # Generate a new room name
                room = Room.objects.create(name=name, player1=user.username)  # Use the generated name for the new room
                logger.info(f"User {user.username} created room {room.name}.")
                return JsonResponse({'status': 'waiting', 'name': room.name})  # Return the created room name
        except Exception as e:
            logger.error(f"Error retrieving rooms: {e}")
            return JsonResponse({'status': 'Error', 'message': str(e)}, status=500)
    else:
        return JsonResponse({'status': 'Bad Request'}, status=400)

def run_game(request, room_name):
	return render(request, 'index.html', {'room_name': room_name})
