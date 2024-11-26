from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie

from django.db import transaction

from cmumarketplace.apis.util.utils import get_authenticated_user, validate_jwt
from cmumarketplace.apis.v1.auth import auth_health_check, auth_validate_google_oauth_token


from rest_framework.decorators import api_view

from cmumarketplace.apis.v1.items import items_get_item, items_get_item_authed, items_get_items, items_get_items_authed
from cmumarketplace.apis.v1.listings import listings_add_listing, listings_delete_listing, listings_get_listing, listings_get_listings, listings_update_listing
from cmumarketplace.apis.v1.profiles import profiles_get_profile, profiles_update_profile

from django.contrib.auth import get_user_model

import base64

User = get_user_model()

def save_image_file_from_b64(base64_string, filename):

    b64_idx = base64_string.find('base64')
    base64_string = base64_string[b64_idx + 6:]
    # Decode the Base64 string into binary data
    image_data = base64.b64decode(base64_string)

    # Specify the path and file name to save the image
    image_path = f'./add_item_images/{filename}'

    # Write the binary data to the file
    with open(image_path, 'wb') as file:
        file.write(image_data)

    print(f"Image saved to {image_path}")


# Auth APIs
@ensure_csrf_cookie
@csrf_protect
@api_view(['POST'])
def validate_google_oauth_token(request):
    """
    Validate a Google OAuth token.

    Args:
        request (HttpRequest): The HTTP request containing the OAuth token.

    Returns:
        HttpResponse: A JSON response containing the details of the validated token.

    """
    return auth_validate_google_oauth_token(request)

@api_view(['GET'])
def health_check(request):
    """
    Perform a health check for the server.
    """
    return auth_health_check(request)


# Listing APIs
@ensure_csrf_cookie
@api_view(['POST'])
@transaction.atomic
@validate_jwt
def add_listing(request):
    return listings_add_listing(request)

@ensure_csrf_cookie
@api_view(['PUT'])
@transaction.atomic
@validate_jwt
def update_listing(request, listing_id):
    return listings_update_listing(request, listing_id)

@ensure_csrf_cookie
@api_view(['GET'])
@transaction.atomic
@validate_jwt
def get_listing(request, listing_id):
    return listings_get_listing(request, listing_id)

@ensure_csrf_cookie
@api_view(['GET'])
@transaction.atomic
@validate_jwt
def get_listings(request):
    return listings_get_listings(request)

@ensure_csrf_cookie
@api_view(['DELETE'])
@transaction.atomic
@validate_jwt
def delete_listing(request, listing_id):
    return listings_delete_listing(request, listing_id)


# Item APIs
@api_view(['GET'])
# @validate_jwt
def get_item(request, id):
    """
    Retrieve details of an item.

    This function retrieves details of a specific item identified by its ID.
    It checks if the user is authenticated and has permission to view the item.
    If the item is found, it returns the item details along with seller information.

    Args:
        request (HttpRequest): The HTTP request.
        id (int): The ID of the item to retrieve details for.

    Returns:
        Response: A JSON response containing the details of the item and seller
            if successful, or an error message if the item is not found.

    """
    try:
        user = get_authenticated_user(request)
        print("USER:", user)
        if user:
            return items_get_item_authed(request, id)
        return items_get_item(request, id)
    except:
        return items_get_item(request, id)
    
@api_view(['GET'])
def get_items(request):
    """
    Retrieve order details.

    This function retrieves the details of a specific order identified by its ID.
    It returns the order details along with buyer and seller information.

    Args:
        request: The HTTP request.
        id: The ID of the order to retrieve details for.

    Returns:
        Response: A JSON response containing the details of the order, including
            buyer and seller information.
    """
    try:
        user = get_authenticated_user(request)
        if user:
            return items_get_items_authed(request)
        return items_get_items(request)
    except:
        return items_get_items(request)


# Profile APIs
@api_view(['GET'])
@validate_jwt
def get_profile(request):
    """
    Retrieve user profile information.

    This function retrieves the profile information of the authenticated user,
    including their profile details, listed items, and orders, and orders for their listed items.

    Args:
        request (HttpRequest): The HTTP request.

    Returns:
        Response: A JSON response containing the user's profile information,
            including profile details, listed items, and orders.

    """
    return profiles_get_profile(request)


@ensure_csrf_cookie
@csrf_protect
@api_view(['PUT'])
@validate_jwt
def update_profile(request):
    """
    Update user profile.

    This function updates the profile information of the authenticated user.

    Args:
        request: The HTTP request containing the updated profile
            information.

    Returns:
        Response: A JSON response containing the updated profile information
            if successful, or an error message if the request is invalid.

    """
    return profiles_update_profile(request)


# @ensure_csrf_cookie
# @csrf_protect
# @api_view(['PUT'])
# @validate_jwt
# def update_item_status(request, id):
#     """
#     Update item status.

#     This function updates the status of an item identified by its ID.

#     Args:
#         request: The HTTP request containing the updated item status.
#         id: The ID of the item to update.

#     Returns:
#         Response: A JSON response containing the updated item details
#             if successful, or an error message if the request is invalid.

#     """
#     if request.method == 'PUT':
#         token = request.headers.get('Authorization')
#         decoded_token = parse_jwt(token)
#         email = decoded_token['email']
#         try:
#             user = User.objects.get(email=email)
#         except User.DoesNotExist:
#             return Response({"message": "User unidentified."}, status=status.HTTP_401_UNAUTHORIZED)
        
#         try:
#             item = Item.objects.get(id = id)
#             item_serializer = ItemSerializer(item)
#             if item_serializer.data['owner'] != email:
#                 return Response({"message": "user cannot edit the requested item"}, status=status.HTTP_401_UNAUTHORIZED)
#             item.current_status = request.data['current_status']
#             item.save()
#             response_data = ItemSerializer(item).data
#             return Response(response_data, status=status.HTTP_200_OK)
#         except Item.DoesNotExist:
#             return Response({"message": "Item unidentified"}, status=status.HTTP_400_BAD_REQUEST)
#     return Response({"message": "invalid operation"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)



