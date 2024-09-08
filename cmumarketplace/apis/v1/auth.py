
from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import HttpResponse

import json

from rest_framework import status

from cmumarketplace.apis.util import validate_oauth_token
from cmumarketplace.apis.util.utils import get_error_string
from cmumarketplace.models import UserProfile
from cmumarketplace.serializers import TokenSerializer

from rest_framework.response import Response

User = get_user_model()

LOCAL_FRONTEND_URL = settings.LOCAL_FRONTEND_URL
PROD_FRONTEND_URL = settings.PROD_FRONTEND_URL

def auth_health_check(request):
    """
    Perform a health check for the server.
    """
    return Response({"status": "Server is healthy"}, status=status.HTTP_200_OK)

def auth_validate_google_oauth_token(request):
    """
    Validate a Google OAuth token.

    Args:
        request (HttpRequest): The HTTP request containing the OAuth token.

    Returns:
        HttpResponse: A JSON response containing the details of the validated token.

    """
    serializer = TokenSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({"message" : get_error_string(serializer)}, status=status.HTTP_400_BAD_REQUEST)

    token = serializer.validated_data['credential']
    decoded_token = validate_oauth_token.get_oauth_token_details(token)

    is_token_valid = validate_oauth_token.validate_token_details(decoded_token)
    if not is_token_valid:
        return Response({"message": "Invalid Google OAuth token"}, status=status.HTTP_401_UNAUTHORIZED)

    user, created = User.objects.get_or_create(email=decoded_token['email'])
    if created:
        user.name = decoded_token['name']
        user.oauth_token = token
    else:
        user.oauth_token = token

    user.save()

    user_profile, _ = UserProfile.objects.get_or_create(user= user, profile_picture= decoded_token['picture'], email_contact= decoded_token['email'])
    user_profile.save()

    decoded_token = json.dumps(decoded_token)
    response_to_send = HttpResponse(decoded_token, content_type='application/json')

    allowed_domains = [LOCAL_FRONTEND_URL, PROD_FRONTEND_URL]
    origin = request.headers.get('Origin')
    if origin in allowed_domains:
        response_to_send['Access-Control-Allow-Origin'] = origin
        response_to_send['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, x-csrftoken'
        response_to_send['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE'

    return response_to_send