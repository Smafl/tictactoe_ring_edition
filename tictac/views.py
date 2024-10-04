from django.shortcuts import render

# Create your views here.

def test(request):
	return render(request, 'test.html')

def run_game(request):
	return render(request, 'index.html')
