"""
URL configuration for hos_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from routing.views import plan_trip, signup_user, login_user, save_trip, get_trip_history

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/plan-trip/', plan_trip, name='plan-trip'),
    path('api/auth/signup/', signup_user, name='signup'),
    path('api/auth/login/', login_user, name='login'),
    path('api/trips/save/', save_trip, name='save-trip'),
    path('api/trips/history/', get_trip_history, name='trip-history'),
]

