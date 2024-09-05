
from django.contrib.auth import get_user_model

from cmumarketplace.apis.util.utils import parse_jwt
from cmumarketplace.serializers import ListingSerializer

from rest_framework.response import Response
from rest_framework import status

User = get_user_model()

def listings_add_listing(request):
    serializer = ListingSerializer(data=request.data)
    if serializer.is_valid():
        token = request.headers.get('Authorization')
        decoded_token = parse_jwt(token)
        email = decoded_token['email']
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"message": "User unidentified."}, status=status.HTTP_401_UNAUTHORIZED)

        if (request.data.get("delivery_or_pickup") == 'delivery' and "pickup_address" in request.data):
            return Response({"message": "Pickup address set for delivery option"}, status=status.HTTP_400_BAD_REQUEST)  
    
        if (request.data.get("delivery_or_pickup") == 'pickup' and "delivery_time" in request.data):
            return Response({"message": "Delivery time set for pickup option"}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer.save(user=user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def listings_update_listing(request):
    serializer = ListingSerializer(data=request.data)
    if serializer.is_valid():
        token = request.headers.get('Authorization')
        decoded_token = parse_jwt(token)
        email = decoded_token['email']
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"message": "User unidentified."}, status=status.HTTP_401_UNAUTHORIZED)

        if (request.data.get("delivery_or_pickup") == 'delivery' and "pickup_address" in request.data):
            return Response({"message": "Pickup address set for delivery option"}, status=status.HTTP_400_BAD_REQUEST)  
    
        if (request.data.get("delivery_or_pickup") == 'pickup' and "delivery_time" in request.data):
            return Response({"message": "Delivery time set for pickup option"}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer.save(user=user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def listings_get_listing(request):
    serializer = ListingSerializer(data=request.data)
    if serializer.is_valid():
        token = request.headers.get('Authorization')
        decoded_token = parse_jwt(token)
        email = decoded_token['email']
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"message": "User unidentified."}, status=status.HTTP_401_UNAUTHORIZED)

        if (request.data.get("delivery_or_pickup") == 'delivery' and "pickup_address" in request.data):
            return Response({"message": "Pickup address set for delivery option"}, status=status.HTTP_400_BAD_REQUEST)  
    
        if (request.data.get("delivery_or_pickup") == 'pickup' and "delivery_time" in request.data):
            return Response({"message": "Delivery time set for pickup option"}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer.save(user=user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def listings_get_listings(request):
    serializer = ListingSerializer(data=request.data)
    if serializer.is_valid():
        token = request.headers.get('Authorization')
        decoded_token = parse_jwt(token)
        email = decoded_token['email']
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"message": "User unidentified."}, status=status.HTTP_401_UNAUTHORIZED)

        if (request.data.get("delivery_or_pickup") == 'delivery' and "pickup_address" in request.data):
            return Response({"message": "Pickup address set for delivery option"}, status=status.HTTP_400_BAD_REQUEST)  
    
        if (request.data.get("delivery_or_pickup") == 'pickup' and "delivery_time" in request.data):
            return Response({"message": "Delivery time set for pickup option"}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer.save(user=user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def listings_delete_listing(request):
    serializer = ListingSerializer(data=request.data)
    if serializer.is_valid():
        token = request.headers.get('Authorization')
        decoded_token = parse_jwt(token)
        email = decoded_token['email']
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"message": "User unidentified."}, status=status.HTTP_401_UNAUTHORIZED)

        if (request.data.get("delivery_or_pickup") == 'delivery' and "pickup_address" in request.data):
            return Response({"message": "Pickup address set for delivery option"}, status=status.HTTP_400_BAD_REQUEST)  
    
        if (request.data.get("delivery_or_pickup") == 'pickup' and "delivery_time" in request.data):
            return Response({"message": "Delivery time set for pickup option"}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer.save(user=user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)