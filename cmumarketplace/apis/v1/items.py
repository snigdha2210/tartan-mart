
from django.contrib.auth import get_user_model
from django.db.models import Q

from cmumarketplace.models import Item
from cmumarketplace.serializers import ItemSerializer

from rest_framework.response import Response
from rest_framework import status

User = get_user_model()

def items_get_items(request):
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

        user_profile = item.listing.user.user_profile.first()

        seller_data = {
            'seller_id': item.listing.user.id,
            'seller_name': item.listing.user.name,
            'seller_email': item.listing.user.email,
            'seller_mobile_number': user_profile.mobile if user_profile else None,
        }

        serialized_data_with_ids.append({
            'item': item_data,
            'seller': seller_data,
            })
    return Response(serialized_data_with_ids, status=status.HTTP_200_OK)

def items_get_item(request, id):
    try:
        item = Item.objects.get(pk=id)
        item_data = ItemSerializer(item).data

        user_profile = item.listing.user.user_profile.first()

        seller_data = {
            'seller_id': item.listing.user.id,
            'seller_name': item.listing.user.name,
            'seller_email': item.listing.user.email,
            'seller_mobile_number': user_profile.mobile if user_profile else None,
        }

        response_data = {
            'item': item_data,
            'seller': seller_data,
        }

        return Response(response_data, status=status.HTTP_200_OK)
    except Item.DoesNotExist:
        return Response({"message": "Item not found."}, status=status.HTTP_404_NOT_FOUND)