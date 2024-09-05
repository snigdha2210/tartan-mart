
from django.contrib.auth import get_user_model

from cmumarketplace.apis.util.utils import get_authenticated_user, parse_jwt
from cmumarketplace.models import Listing
from cmumarketplace.serializers import ListingSerializer

from rest_framework.response import Response
from rest_framework import status

User = get_user_model()

def listings_add_listing(request):
    user = get_authenticated_user(request)
    if not user:
        return Response({"message": "User unidentified."}, status=status.HTTP_401_UNAUTHORIZED)
    serializer = ListingSerializer(data=request.data)
    if serializer.is_valid():
        if (request.data.get("delivery_or_pickup") == 'delivery' and "pickup_address" in request.data):
            return Response({"message": "Pickup address set for delivery option"}, status=status.HTTP_400_BAD_REQUEST)  
    
        if (request.data.get("delivery_or_pickup") == 'pickup' and "delivery_time" in request.data):
            return Response({"message": "Delivery time set for pickup option"}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer.save(user=user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def listings_update_listing(request, listing_id):
    user = get_authenticated_user(request)
    if not user:
        return Response({"message": "User unidentified."}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        listing = Listing.objects.get(id=listing_id, user=user)
    except Listing.DoesNotExist:
        return Response({"message": "Listing not found."}, status=status.HTTP_404_NOT_FOUND)

    serializer = ListingSerializer(listing, data=request.data, partial=True)
    if serializer.is_valid():
        if (request.data.get("delivery_or_pickup") == 'delivery' and "pickup_address" in request.data):
            return Response({"message": "Pickup address set for delivery option"}, status=status.HTTP_400_BAD_REQUEST)  
    
        if (request.data.get("delivery_or_pickup") == 'pickup' and "delivery_time" in request.data):
            return Response({"message": "Delivery time set for pickup option"}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save(user=user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def listings_get_listing(request, listing_id):
    user = get_authenticated_user(request)
    if not user:
        return Response({"message": "User unidentified."}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        listing = Listing.objects.get(id=listing_id, user=user)
    except Listing.DoesNotExist:
        return Response({"message": "Listing not found."}, status=status.HTTP_404_NOT_FOUND)

    serializer = ListingSerializer(listing)
    return Response(serializer.data, status=status.HTTP_200_OK)

def listings_get_listings(request):
    user = get_authenticated_user(request)
    if not user:
        return Response({"message": "User unidentified."}, status=status.HTTP_401_UNAUTHORIZED)

    listings = Listing.objects.filter(user=user)
    serializer = ListingSerializer(listings, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


def listings_delete_listing(request, listing_id):
    user = get_authenticated_user(request)
    if not user:
        return Response({"message": "User unidentified."}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        listing = Listing.objects.get(id=listing_id, user=user)
    except Listing.DoesNotExist:
        return Response({"message": "Listing not found."}, status=status.HTTP_404_NOT_FOUND)

    listing.delete()
    return Response({"message": "Listing deleted successfully."}, status=status.HTTP_200_OK)