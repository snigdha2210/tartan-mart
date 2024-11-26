from django.contrib.auth import get_user_model

from cmumarketplace.apis.util.utils import get_authenticated_user, get_error_string, parse_jwt, validate_jwt
from cmumarketplace.models import Listing, UserProfile
from cmumarketplace.serializers import ListingSerializer, ProfileSerializer

from rest_framework.response import Response
from rest_framework import status

User = get_user_model()

@validate_jwt
def profiles_get_profile(request):
    user = get_authenticated_user(request)
    response_data = {}
    try:
        profile = UserProfile.objects.get(user=user)
        serializer = ProfileSerializer(profile)
        response_data['profile'] = serializer.data
        response_data['profile']['name'] = user.name
        response_data['profile']['email'] = user.email 
        response_data['profile']['date_joined'] = user.date_joined.strftime("%m/%d/%Y")
    except UserProfile.DoesNotExist:
        return Response({"message": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)

    listings = Listing.objects.filter(user=user)
    serializer = ListingSerializer(listings, many=True)
    user_listings = serializer.data
    for listing in user_listings:
        listing_item = listing.pop('listing_item')
        listing_images = []
        for item in listing_item:
            listing_images.append({'image': item['image']})
        listing['listing_item'] = listing_images
    
    response_data['listings'] = user_listings
    return Response(response_data, status=status.HTTP_200_OK)

@validate_jwt
def profiles_update_profile(request):
    if request.method == 'PUT':
        # token = request.headers.get('Authorization')
        # decoded_token = parse_jwt(token)
        # email = decoded_token['email']
        # try:
        #     user = User.objects.get(email=email)
        # except User.DoesNotExist:
        #     return Response({"message": "User unidentified."}, status=status.HTTP_401_UNAUTHORIZED)
        user = get_authenticated_user(request)
        try:
            user_profile = UserProfile.objects.get(user= user)
        except UserProfile.DoesNotExist:
            return Response({'message': "No profile found"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            serializer = ProfileSerializer(user_profile, data = request.data)
            if serializer.is_valid():
                serializer.save()
                response_data = serializer.data
                return Response(response_data, status=status.HTTP_200_OK)
            return Response({"message": get_error_string(serializer)}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({"message": "could not process request"}, status=status.HTTP_400_BAD_REQUEST)
    return Response({"message": "invalid operation"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)