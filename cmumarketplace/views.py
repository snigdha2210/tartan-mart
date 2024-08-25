from django.http import HttpResponse, JsonResponse
import json
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie

from django.db.models import Q
from django.db import transaction

from . import validate_oauth_token

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .serializers import TokenSerializer, ItemSerializer, ProfileSerializer

from .models import CustomUser, Item, UserProfile

from .utils import validate_jwt, parse_jwt

from django.contrib.auth import get_user_model

from django.conf import settings
import stripe

User = get_user_model()


stripe.api_key = settings.STRIPE_SECRET_KEY
LOCAL_FRONTEND_URL = settings.LOCAL_FRONTEND_URL
PROD_FRONTEND_URL = settings.PROD_FRONTEND_URL

def get_error_string(serializer):
    error_string = "Invalid: "
    for key in serializer.errors:
        error_string += key + ": "
        for e in serializer.errors.get(key):
            if e.title():
                error_string += e.title()
                break
    return error_string
'''
removing order features for live version
'''
# class StripeCheckoutView(APIView):
#     """
#     API View for handling Stripe checkout.

#     This view is responsible for processing Stripe checkout requests. It receives
#     a POST request containing cart items and user information, creates a new order,
#     generates a checkout session with Stripe, and returns the checkout URL to the client.

#     Methods:
#         post(self, request): Handles POST requests for creating a Stripe checkout session.

#     Returns:
#         JsonResponse: A JSON response containing the checkout URL.
#         Response: A response indicating the error if something goes wrong during checkout.

#     """
#     @transaction.atomic
#     def post(self, request):
#         """
#         Handle POST requests for creating a Stripe checkout session.
#         """
#         try:
#             data = json.loads(request.body)
#             validated_cart = validate_cart(data['cartItems'])
#             if not validated_cart['valid']:
#                 return Response({'errors': validated_cart['errors']}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

#             # fetching the user
#             token = request.headers.get('Authorization')
#             decoded_token = parse_jwt(token)
#             email = decoded_token['email']
#             try:
#                 user = CustomUser.objects.get(email=email)
#             except User.DoesNotExist:
#                 return Response({"message": "User unidentified."}, status=status.HTTP_401_UNAUTHORIZED)

#             new_order = Order(buyer=user, payment_status='pending', delivery_address=data['address'])
#             new_order.save()
#             total_price = 0
#             line_items_list = []
#             for obj in data['cartItems']:
#                 item = obj.get('item')
#                 qty = obj.get('quantity')

#                 try:
#                     db_item = Item.objects.select_for_update().get(id=item['id'])
#                     total_price = total_price + (db_item.price * qty)
#                     new_order.items.add(db_item, through_defaults={'quantity': qty})
#                     new_order.save()
#                 except Exception as e:
#                     raise e

#                 line_items_list.append({
#                     'price_data': {
#                         'currency': 'usd',
#                         'unit_amount_decimal': str(float(item['price']) * 100),
#                         'product_data': {
#                             'name': item['name'],
#                             'description': item['description'],
#                             'images': [item['image'], ],
#                         }
#                     },
#                     'quantity': qty
#                 })
#             new_order.total_price = total_price
#             new_order.save()

#             checkout_session = stripe.checkout.Session.create(
#                 line_items=line_items_list,
#                 payment_method_types=['card'],
#                 mode='payment',
#                 success_url=settings.SITE_URL + f'/order-details/{new_order.id}?success=true&session_id={{CHECKOUT_SESSION_ID}}',
#                 cancel_url=settings.SITE_URL + f'/order-details/{new_order.id}?canceled=true',
#             )

#             new_order.checkout_id = checkout_session.id
#             new_order.save()
#             return JsonResponse({'url': checkout_session.url})
#         except Exception as e:
#             new_order.payment_status = 'failed'
#             order_items = OrderItem.objects.filter(order=new_order)
#             for order_item in order_items:
#                 order_item.increase_item_quantity()
#             new_order.save()
#             return Response(
#                 {'error': 'Something went wrong when creating stripe checkout session. Please try later.'},
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR
#             )


'''
removing order features for live version
'''
# @api_view(['GET'])
# @validate_jwt
# def get_order_details(request, id):
#     """
#     Retrieve details of an order.

#     This function retrieves details of a specific order identified by its ID.
#     It retrieves the checkout session information from Stripe based on the order's
#     checkout ID, updates the order's payment status accordingly, and returns the
#     order details in JSON format.

#     Args:
#         request (HttpRequest): The HTTP request.
#         id (int): The ID of the order to retrieve details for.

#     Returns:
#         JsonResponse: A JSON response containing the details of the order.
        
#     Raises:
#         JsonResponse: If the requested order does not exist or an unexpected error occurs.

#     """
#     if request.method == "GET":
#         # Retrieve the order_id from the GET request
#         order_id = int(id)
#         try:
#             order = Order.objects.get(id=order_id)

#             # Retrieve the checkout_id from the order object
#             checkout_id = order.checkout_id

#             # Retrieve the checkout session from Stripe
#             checkout_session = stripe.checkout.Session.retrieve(checkout_id)

#             # Check if the session is still open
#             if checkout_session.get("status") == "open":
#                 expired_session = stripe.checkout.Session.expire(checkout_id)
#                 if expired_session.get('payment_status') == 'paid':
#                     order.payment_status = 'completed'
#                 else:
#                     order.payment_status = 'failed'
#                     order_items = OrderItem.objects.filter(order=order)
#                     for order_item in order_items:
#                         order_item.increase_item_quantity()
#                 order.save()
#             else:
#                 retrieved_session = stripe.checkout.Session.retrieve(checkout_id)
#                 if retrieved_session.get('payment_status') == 'paid':
#                     order.payment_status = 'completed'
#                 else:
#                     order.payment_status = 'failed'
#                 order.save()

#             order_serializer = ODOrderSerializer(order)

#             response_data = {
#                 "order": order_serializer.data,
#             }
#             return JsonResponse(response_data)

#         except Order.DoesNotExist:
#             return JsonResponse({"error": "Order does not exist."}, status=404)
#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=400)
#     else:
#         return JsonResponse({"error": "Only GET requests are allowed."}, status=405)

'''
removing order features for live version
'''
# @transaction.atomic
# def validate_cart(cart_items):
#     """
#     Validate the items in the shopping cart.

#     This function checks the availability of items in the shopping cart and updates
#     the quantities of items in the database accordingly.

#     Args:
#         cart_items: A list of dictionaries representing items in the cart.

#     Returns:
#         dict: A dictionary indicating whether the cart is valid or not, and any
#             errors encountered during validation.

#     """
#     result = {"valid": True, "errors": []}
#     if len(cart_items) == 0:
#         result['errors'].append('No items in cart.')
#         result['valid'] = False
#         return result
#     for object in cart_items:
#         item = object.get('item')

#         try:
#             db_item = Item.objects.select_for_update().get(id=item['id'])

#             if db_item.quantity >= object.get('quantity'):
#                 db_item.quantity = db_item.quantity - object.get('quantity')
#                 db_item.save()
#                 if db_item.quantity == 0:
#                     db_item.current_status = 'deleted'
#                     db_item.save()
#             else:
#                 result['errors'].append(f'Insufficient Quantity for item {db_item.name}')
#                 result['valid'] = False
#                 return result

#         except Item.DoesNotExist:
#             result['errors'].append(f'Item {db_item.name} does not exist.')
#             result['valid'] = False
#             return result

#         except Exception as e:
#             raise e
        
#     return result

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

@api_view(['GET'])
def health_check(request):
    """
    Perform a health check for the server.
    """
    return Response({"status": "Server is healthy"}, status=status.HTTP_200_OK)

@ensure_csrf_cookie
@api_view(['POST'])
@validate_jwt
def add_item(request):
    """
    Add an item.

    This function adds an item to the Item Model. It expects a POST request
    with item data in the request body. It validates the item data, ensures
    that the user is authenticated, and associates the item with the user's
    account.

    Args:
        request: The HTTP request containing the item data.

    Returns:
        Response: A JSON response containing the details of the added item
            if successful, or an error message dictionary if the request is invalid.
    """
    if request.method == 'POST':
        serializer = ItemSerializer(data=request.data)
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
        
            item = serializer.save(user=user)
            response_data = serializer.data
            response_data['id'] = item.id
            return Response(response_data, status=status.HTTP_201_CREATED)
        
        return Response({"message": get_error_string(serializer)}, status=status.HTTP_400_BAD_REQUEST)
    return Response({"message": "invalid operation"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
        
@api_view(['GET'])
@validate_jwt
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
        item = Item.objects.get(pk=id)
        item_data = ItemSerializer(item).data

        user_profile = item.user.user_profile.first()

        seller_data = {
            'seller_id': item.user.id,
            'seller_name': item.user.name,
            'seller_email': item.user.email,
            'seller_mobile_number': user_profile.mobile if user_profile else None,
        }

        response_data = {
            'item': item_data,
            'seller': seller_data,
        }

        return Response(response_data, status=status.HTTP_200_OK)
    except Item.DoesNotExist:
        return Response({"message": "Item not found."}, status=status.HTTP_404_NOT_FOUND)


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
    token = request.headers.get('Authorization')
    decoded_token = parse_jwt(token)
    email = decoded_token['email']
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"message": "User unidentified."}, status=status.HTTP_401_UNAUTHORIZED)
    
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

    try:
        my_items = Item.objects.filter(user__email = email).order_by("listed_date").reverse()
        response_data['items'] = []
        for item in my_items:
            data_item = ItemSerializer(item).data
            response_data['items'].append(data_item)
    except:
        return Response({"message": "My listings not found."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    '''
    removing order features for live version
    '''
    # try:
    #     my_orders = Order.objects.filter(buyer__email = email).order_by("order_date").reverse()
    #     response_data['orders'] = []
    #     for order in my_orders:
    #         response_data['orders'].append(OrderSerializer(order).data)
    # except:
    #     return Response({"message": "My orders not found."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # try:
    #     #TODO: order by order date?
    #     my_items_order = OrderItem.objects.filter(item__user__email = email).order_by('order__order_date').reverse()
    #     response_data['items_order'] = []
    #     for items_order in my_items_order:
    #         response_data['items_order'].append(OrderItemSerializer(items_order).data)
    # except:
    #     return Response({"message": "My orders for listings not found."}, status=status.HTTP_404_NOT_FOUND)
    return Response(response_data, status=status.HTTP_200_OK)


    

    
@api_view(['GET'])
def get_listings(request):
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

    search_keyword = request.GET.get('search')
    categories = request.GET.get('category')

    items = Item.objects.filter(current_status='listed')

    if search_keyword:
        items = items.filter(Q(name__icontains=search_keyword) | Q(description__icontains=search_keyword))

    if categories:
        categories = categories.split(',')
        items = items.filter(category__in=categories)

    serialized_data_with_ids = []

    for item in items:
        item_data = ItemSerializer(item).data
        item_data['id'] = item.id

        user_profile = item.user.user_profile.first()

        seller_data = {
            'seller_id': item.user.id,
            'seller_name': item.user.name,
            'seller_email': item.user.email,
            'seller_mobile_number': user_profile.mobile if user_profile else None,
        }

        serialized_data_with_ids.append({
            'item': item_data,
            'seller': seller_data,
            })
    return Response(serialized_data_with_ids, status=status.HTTP_200_OK)


'''
removing order features for live version
'''
# @api_view(['GET'])
# @validate_jwt
# def get_order(request, id):
#     """
#     Retrieve order details.

#     This function retrieves the details of a specific order identified by its ID.
#     It returns the order details along with buyer and seller information.

#     Args:
#         request (HttpRequest): The HTTP request.
#         id (int): The ID of the order to retrieve details for.

#     Returns:
#         Response: A JSON response containing the details of the order, including
#             buyer and seller information.

#     """
#     if request.method == "GET":
#         response_data = {}
#         try:
#             orders = Order.objects.filter(id = id)
#             if len(orders) == 0:
#                 return Response({"message": "no order found"}, status=status.HTTP_404_NOT_FOUND)
#             order_data = OrderSerializer(orders[0]).data
#         except:

#             return Response({"message": "Data could not be retrived"}, status=status.HTTP_404_NOT_FOUND)
#         try:
#             buyer_email = order_data['owner']
#             buyer_user = User.objects.get(email = buyer_email)
#             buyer_profile = UserProfile.objects.get(user= buyer_user)
#             serialized_profile = ProfileSerializer(buyer_profile).data 
#             response_data['buyer'] = {}
#             response_data['buyer']['name'] = buyer_user.name
#             response_data['buyer']['email_contact'] = serialized_profile['email_contact']
#             response_data['buyer']['mobile'] = serialized_profile['mobile']
#         except:
#             return Response({"message": "Data could not be retrived"}, status=status.HTTP_404_NOT_FOUND) 

#         try:
#             for purchased_item in order_data["items"]:
#                 seller_email = purchased_item['item']['owner']
#                 seller_user = User.objects.get(email = seller_email)
#                 seller_profile = UserProfile.objects.get(user = seller_user)
#                 serialized_profile = ProfileSerializer(seller_profile).data
#                 purchased_item["seller"] = {}
#                 purchased_item['seller']['name'] = seller_user.name
#                 purchased_item['seller']['email_contact'] = serialized_profile['email_contact']
#                 purchased_item['seller']['mobile'] = serialized_profile['mobile']
#         except:
#             return Response({"message": "Data could not be retrived"}, status=status.HTTP_404_NOT_FOUND) 


#         response_data.update(order_data)
#         return Response(response_data, status=status.HTTP_200_OK)

#     return Response({"message": "invalid operation"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

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
    if request.method == 'PUT':
        token = request.headers.get('Authorization')
        decoded_token = parse_jwt(token)
        email = decoded_token['email']
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"message": "User unidentified."}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            user_profile = UserProfile.objects.get(user= user)
        except UserProfile.DoesNotExist:
            return Response({'message': "No profile found"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            serializer = ProfileSerializer(user_profile, data = request.data)
            if serializer.is_valid():
                serializer.save()
                response_data = serializer.data
                return Response(response_data, status=status.HTTP_201_CREATED)
            return Response({"message": get_error_string(serializer)}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({"message": "could not process request"}, status=status.HTTP_400_BAD_REQUEST)
    return Response({"message": "invalid operation"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@ensure_csrf_cookie
@csrf_protect
@api_view(['PUT'])
@validate_jwt
def update_item_status(request, id):
    """
    Update item status.

    This function updates the status of an item identified by its ID.

    Args:
        request: The HTTP request containing the updated item status.
        id: The ID of the item to update.

    Returns:
        Response: A JSON response containing the updated item details
            if successful, or an error message if the request is invalid.

    """
    if request.method == 'PUT':
        token = request.headers.get('Authorization')
        decoded_token = parse_jwt(token)
        email = decoded_token['email']
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"message": "User unidentified."}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            item = Item.objects.get(id = id)
            item_serializer = ItemSerializer(item)
            if item_serializer.data['owner'] != email:
                return Response({"message": "user cannot edit the requested item"}, status=status.HTTP_401_UNAUTHORIZED)
            item.current_status = request.data['current_status']
            item.save()
            response_data = ItemSerializer(item).data
            return Response(response_data, status=status.HTTP_200_OK)
        except Item.DoesNotExist:
            return Response({"message": "Item unidentified"}, status=status.HTTP_400_BAD_REQUEST)
    return Response({"message": "invalid operation"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)



