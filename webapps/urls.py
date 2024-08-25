"""
URL configuration for webapps project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
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
from cmumarketplace import views

urlpatterns = [
    # path('setcsrfcookie/', views.set_csrf_cookie, name='set-csrf-cookie'),
    path('token/', views.validate_google_oauth_token, name='validate-token'),
    path('healthcheck/', views.health_check, name='health-check'),
    path('addItem/', views.add_item, name='add_item'),
    path('listings/item/<int:id>/', views.get_item, name='get_item'),
    path('listings/', views.get_listings, name='get_listings'),
    path('getProfile/', views.get_profile, name='get_profile'),
    path('updateProfile/', views.update_profile, name='update_profile'),
    # removing order features for live version
    # path('api/stripe/create-checkout-session', views.StripeCheckoutView.as_view()),
    # path('getOrderDetails/<int:id>/', views.get_order_details, name='get-order-details'),
    # path('getOrder/<int:id>/', views.get_order, name= "get_order"),
    path('updateItemStatus/<int:id>/', views.update_item_status, name="update_item"),
]
