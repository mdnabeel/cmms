from django.shortcuts import render

# Create your views here.

def home(request):
    return render(request, 'webpages/home.html')

def login(request):
    return render(request, 'webpages/login.html')

def contact(request):
    return render(request, 'webpages/contact.html')

def services(request): 
    return render(request, 'webpages/services.html')

def gallery(request):
    return render(request, 'webpages/gallery.html')


