import base64
import json

from rest_framework.response import Response
from rest_framework import status
from functools import wraps

import json
import base64

from django.contrib.auth import get_user_model

from rest_framework.response import Response
from rest_framework import status

User = get_user_model()

def parse_jwt(token):
    try:
        # Split the token into its three parts
        parts = token.split('.')
        
        # Extract and decode the payload part (second part)
        payload_b64 = parts[1]
        payload_bytes = base64.urlsafe_b64decode(payload_b64 + '=' * (4 - len(payload_b64) % 4))
        payload = payload_bytes.decode('utf-8')
        
        # Parse the JSON payload
        payload_json = json.loads(payload)
        
        return payload_json
    except Exception as e:
        # Handle any exceptions that might occur during decoding or parsing
        print(f"Error parsing JWT: {e}")
        return None

def validate_jwt(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        # Check if Authorization header is present
        token = request.headers.get('Authorization')
        try:
            jwt_token = token.split(' ')[1]
            payload = parse_jwt(jwt_token)
            email = payload.get('email')
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({"message": "User unidentified."}, status=status.HTTP_401_UNAUTHORIZED)
        except:
            return Response({'message': 'JWT Token cannot be decoded.'}, status=status.HTTP_401_UNAUTHORIZED)

        return view_func(request, *args, **kwargs)

    return wrapper

def _my_json_error_response(message, key='message', status=status.HTTP_200_OK):
    '''
    This private function is used for sending custom error messages with
    appropriate status codes.
    '''
    # You can create your JSON by constructing the string representation yourself (or just use json.dumps)
    response_json = '{"' + key + '": "' + message + '"}'
    response_json = json.loads(response_json)
    return Response(response_json, content_type='application/json', status=status)

def get_error_string(serializer):
    error_string = "Invalid: "
    for key in serializer.errors:
        error_string += key + ": "
        for e in serializer.errors.get(key):
            if e.title():
                error_string += e.title()
                break
    return error_string

def get_authenticated_user(request):
    token = request.headers.get('Authorization')
    if not token or not token.startswith('Bearer '):
        return None
        
    try:
        jwt_token = token.split(' ')[1]
        decoded_token = parse_jwt(jwt_token)
        if not decoded_token:
            return None
            
        email = decoded_token.get('email')
        if not email:
            return None
            
        try:
            user = User.objects.get(email=email)
            return user
        except User.DoesNotExist:
            return None
    except Exception as e:
        print(f"Error in get_authenticated_user: {e}")
        return None