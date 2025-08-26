from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name="home"),
    path('login/', views.login, name='login'),
    path('contact/', views.contact, name='contact'),
    path('services/', views.services, name='services'),
    path('gallery/', views.gallery, name='gallery'),
]