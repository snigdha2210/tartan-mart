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

from rest_framework import permissions

from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Tartan Mart APIs",
        default_version='v1',
        description="APIs for Tartan Mart",
        terms_of_service="https://www.example.com/terms/",
        contact=openapi.Contact(email="webdev@andrew.cmu.edu"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    # Util APIs
    path('token/', views.validate_google_oauth_token, name='validate-token'),
    path('healthcheck/', views.health_check, name='health-check'),
    
    # Listing APIs
    path('addListing/', views.add_listing, name='add_listing'),
    path('updateListing/<int:listing_id>/', views.update_listing, name='update_listing'),
    path('listing/<int:listing_id>/', views.get_listing, name='get_listing'),
    path('listing/', views.get_listings, name='get_listings'),
    path('deleteListing/<int:listing_id>/', views.delete_listing, name='delete_listing'),

    # Item APIs
    path('store/', views.get_items, name='get_items'),
    path('store/item/<int:id>/', views.get_item, name='get_item'),
    
    # Profile APIs
    path('getProfile/', views.get_profile, name='get_profile'),
    path('updateProfile/', views.update_profile, name='update_profile'),

    # path('updateItemStatus/<int:id>/', views.update_item_status, name="update_item"),

    # path('addItem/', views.add_item, name='add_item'),
    # removing order features for live version
    # path('api/stripe/create-checkout-session', views.StripeCheckoutView.as_view()),
    # path('getOrderDetails/<int:id>/', views.get_order_details, name='get-order-details'),
    # path('getOrder/<int:id>/', views.get_order, name= "get_order"),
    
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
