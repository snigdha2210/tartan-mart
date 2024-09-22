
from django.contrib.auth import get_user_model
from django.db.models import Q

from cmumarketplace.apis.util.utils import validate_jwt
from cmumarketplace.models import Item
from cmumarketplace.serializers import ItemSerializer

from rest_framework.response import Response
from rest_framework import status

User = get_user_model()

def items_get_items(request):
    search_keyword = request.GET.get('search')
    categories = request.GET.get('category')
    min_price = request.GET.get('minPrice')
    max_price = request.GET.get('maxPrice')

    items = Item.objects.filter(current_status='listed')

    if search_keyword:
        items = items.filter(Q(name__icontains=search_keyword) | Q(description__icontains=search_keyword))

    if categories:
        categories = categories.split(',')
        items = items.filter(category__in=categories)

    # Filter by min_price and max_price
    if min_price:
        try:
            min_price = float(min_price)
            items = items.filter(price__gte=min_price)
        except ValueError:
            return Response({"message": "Invalid minPrice value."}, status=status.HTTP_400_BAD_REQUEST)
    
    if max_price:
        try:
            max_price = float(max_price)
            items = items.filter(price__lte=max_price)
        except ValueError:
            return Response({"message": "Invalid maxPrice value."}, status=status.HTTP_400_BAD_REQUEST)

    serialized_data_with_ids = []

    for item in items:
        item_data = ItemSerializer(item).data
        item_data['id'] = item.id

        user_listing = item.listing
        user_profile = user_listing.user.user_profile.first()

        # seller_data = {
        #     'seller_id': item.listing.user.id,
        #     'seller_name': item.listing.user.name,
        #     'seller_email': item.listing.user.email,
        #     'seller_mobile_number': user_profile.mobile if user_profile else None,
        # }

        item_data['listed_date'] = user_listing.created_date
        # item_data['delivery_or_pickup'] = user_listing.delivery_or_pickup
        # if item_data['delivery_or_pickup'] == 'delivery':
        #     item_data['delivery_time'] = user_listing.delivery_time
        # elif item_data['delivery_or_pickup'] == 'pickup':
        #     item_data['pickup_address'] = user_listing.pickup_address

        serialized_data_with_ids.append({
            'item': item_data,
            # 'seller': seller_data,
            })
    return Response(serialized_data_with_ids, status=status.HTTP_200_OK)

@validate_jwt
def items_get_items_authed(request):
    search_keyword = request.GET.get('search')
    categories = request.GET.get('category')
    min_price = request.GET.get('minPrice')
    max_price = request.GET.get('maxPrice')

    items = Item.objects.filter(current_status='listed')

    if search_keyword:
        items = items.filter(Q(name__icontains=search_keyword) | Q(description__icontains=search_keyword))

    if categories:
        categories = categories.split(',')
        items = items.filter(category__in=categories)

    # Filter by min_price and max_price
    if min_price:
        try:
            min_price = float(min_price)
            items = items.filter(price__gte=min_price)
        except ValueError:
            return Response({"message": "Invalid minPrice value."}, status=status.HTTP_400_BAD_REQUEST)
    
    if max_price:
        try:
            max_price = float(max_price)
            items = items.filter(price__lte=max_price)
        except ValueError:
            return Response({"message": "Invalid maxPrice value."}, status=status.HTTP_400_BAD_REQUEST)

    serialized_data_with_ids = []

    for item in items:
        item_data = ItemSerializer(item).data
        item_data['id'] = item.id

        user_listing = item.listing
        user_profile = user_listing.user.user_profile.first()

        seller_data = {
            'seller_id': item.listing.user.id,
            'seller_name': item.listing.user.name,
            'seller_email': item.listing.user.email,
            'seller_mobile_number': user_profile.mobile if user_profile else None,
        }

        item_data['listed_date'] = user_listing.created_date
        item_data['delivery_or_pickup'] = user_listing.delivery_or_pickup
        if item_data['delivery_or_pickup'] == 'delivery':
            item_data['delivery_time'] = user_listing.delivery_time
        elif item_data['delivery_or_pickup'] == 'pickup':
            item_data['pickup_address'] = user_listing.pickup_address

        serialized_data_with_ids.append({
            'item': item_data,
            'seller': seller_data,
            })
    return Response(serialized_data_with_ids, status=status.HTTP_200_OK)

def items_get_item(request, id):
    try:
        item = Item.objects.get(pk=id)
        item_data = ItemSerializer(item).data

        user_listing = item.listing
        user_profile = user_listing.user.user_profile.first()

        item_data['listed_date'] = user_listing.created_date
        item_data['delivery_or_pickup'] = user_listing.delivery_or_pickup
        if item_data['delivery_or_pickup'] == 'delivery':
            item_data['delivery_time'] = user_listing.delivery_time
        elif item_data['delivery_or_pickup'] == 'pickup':
            item_data['pickup_address'] = user_listing.pickup_address
        
        # Fetch extra items by the same user
        extra_items = Item.objects.filter(listing__user=user_listing.user, current_status='listed').exclude(pk=item.pk)
        extra_items_data = ItemSerializer(extra_items, many=True).data

        response_data = {
            'item': item_data,
            'extra_items': extra_items_data,  # Add the extra items here
        }

        return Response(response_data, status=status.HTTP_200_OK)
    except Item.DoesNotExist:
        return Response({"message": "Item not found."}, status=status.HTTP_404_NOT_FOUND)

    
@validate_jwt
def items_get_item_authed(request, id):
    try:
        item = Item.objects.get(pk=id)
        item_data = ItemSerializer(item).data

        user_listing = item.listing
        user_profile = user_listing.user.user_profile.first()

        item_data['listed_date'] = user_listing.created_date
        item_data['delivery_or_pickup'] = user_listing.delivery_or_pickup
        if item_data['delivery_or_pickup'] == 'delivery':
            item_data['delivery_time'] = user_listing.delivery_time
        elif item_data['delivery_or_pickup'] == 'pickup':
            item_data['pickup_address'] = user_listing.pickup_address
        
        seller_data = {
            'seller_id': item.listing.user.id,
            'seller_name': item.listing.user.name,
            'seller_email': item.listing.user.email,
            'seller_mobile_number': user_profile.mobile if user_profile else None,
        }

        # Fetch extra items by the same user
        extra_items = Item.objects.filter(listing__user=user_listing.user, current_status='listed').exclude(pk=item.pk)
        extra_items_data = ItemSerializer(extra_items, many=True).data

        response_data = {
            'item': item_data,
            'seller': seller_data,
            'extra_items': extra_items_data,  # Add the extra items here
        }

        return Response(response_data, status=status.HTTP_200_OK)
    except Item.DoesNotExist:
        return Response({"message": "Item not found."}, status=status.HTTP_404_NOT_FOUND)
