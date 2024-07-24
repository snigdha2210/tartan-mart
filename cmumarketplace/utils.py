import base64
import json

from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
from functools import wraps

import json
import base64

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
        # if not token:
        #     print("1. TOKEN MISSING")
        #     return Response({'message': 'JWT Token is missing.'}, status=status.HTTP_401_UNAUTHORIZED)

        # Extract JWT token from Authorization header
        try:
            jwt_token = token.split(' ')[1]
            #print("JWT TOKEN:", jwt_token)
            payload = parse_jwt(jwt_token)
            #print("PROCESSED_PAYLOAD:", payload)
        except:
            #print("2. TOKEN CANNOT BE DECODED")
            return Response({'message': 'JWT Token cannot be decoded.'}, status=status.HTTP_401_UNAUTHORIZED)

        print("PAYLOAD:", payload)
        # if 'sub' not in payload or 'exp' not in payload or 'iss' not in payload:
        #     #print("3. TOKEN FIELDS MISSING")
        #     return Response({'message': 'JWT Token fields are missing.'}, status=status.HTTP_401_UNAUTHORIZED)
        # # Check if sub claim is valid
        # if payload['sub'] not in ['starlord', 'gamora', 'drax', 'rocket', 'groot']:
        #     #print("4. TOKEN SUBJECT INVALID")
        #     return Response({'message': 'JWT Token subject is invalid.'}, status=status.HTTP_401_UNAUTHORIZED)

        # # if datetime.fromtimestamp(payload['exp']).year > 9999:
        # #     return Response({'message': 'Invalid expiry.'}, status=status.HTTP_401_UNAUTHORIZED)
        # # Check if exp claim is in the future
        # if not len(str(payload['exp'])) > 10:
        #     try:
        #         if datetime.fromtimestamp(payload['exp']) < datetime.now():
        #             #print("5. TOKEN EXPIRED")
        #             return Response({'message': 'JWT Token is expired.'}, status=status.HTTP_401_UNAUTHORIZED)
        #     except:
        #         #print("6. EXPIRY INVALID")
        #         return Response({'message': 'Invalid expiry.'}, status=status.HTTP_401_UNAUTHORIZED)

        # # Check if iss claim is valid
        # if payload['iss'] != 'cmu.edu':
        #     #print("7. ISSUER INVALID")
        #     return Response({'message': 'JWT Token issuer is invalid.'}, status=status.HTTP_401_UNAUTHORIZED)

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