from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .models import Room, GameResult
import json
import logging

# Create your views here.
logger = logging.getLogger(__name__)  # Configure logging

def welcome(request):
	return render(request, 'welcome.html')

def create_room(request):
	if request.method == 'POST':
		try:
			logger.info("Received POST request for creating room.")
			user = request.user
			name = f'Room-{Room.objects.count() + 1}'
			room = Room.objects.create(name=name, player1=user.username)
			logger.info(f"User {user.username} created room {room.name}.")
			return JsonResponse({'status': 'joined', 'name': room.name})
		except Exception as e:
			logger.error(f"Error retrieving rooms: {e}")
			return JsonResponse({'status': 'Error', 'message': str(e)}, status=500)
	else:
		return JsonResponse({'status': 'Bad Request'}, status=400)

def run_game(request, room_name):
	context = {
		'room_name': room_name,
		'player1': 'Player1 Name',
		'player2': 'Player2 Name'
	}
	return render(request, 'index.html', context)

@csrf_exempt
def save_game_result(request, room_name):
	if request.method == 'POST':
		data = json.loads(request.body)
		# game_state = data.get('state')
		game_winner = data.get('winner')
		# game_is_draw = data.get('is_draw')

		try:
			room = Room.objects.get(name=room_name)
			# result = GameResult.objects.create(room=room, state=game_state, winner=game_winner, is_draw=game_is_draw)
			result = GameResult.objects.create(room=room, winner=game_winner)
			result.save()
			logger.info(f"Result for {result.room} saved, state is {result.state}")
			return JsonResponse({'status': 'success', 'message': 'Game result saved'})
		except Room.DoesNotExist:
			return JsonResponse({'status': 'Bad Request'}, status=400)

# user clicks 'play tictac' button
# room creates with one user
# button 'add second user'
# play on one page
# save result for one/two user(s)
