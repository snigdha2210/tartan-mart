
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

from cmumarketplace.apis.util.utils import get_authenticated_user, parse_jwt
from cmumarketplace.models import Item, Listing
from cmumarketplace.serializers import ItemSerializer, ListingSerializer, save_base64_image

from rest_framework.response import Response
from rest_framework import status

User = get_user_model()

def listings_add_listing(request):
    user = get_authenticated_user(request)
    if not user:
        return Response({"message": "User unidentified."}, status=status.HTTP_401_UNAUTHORIZED)
    serializer = ListingSerializer(data=request.data)

    if serializer.is_valid():
        if request.data.get("delivery_or_pickup", None) is None:
            return Response({"message": "Choose pickup or delivery"}, status=status.HTTP_400_BAD_REQUEST)  

        if (request.data.get("delivery_or_pickup") == 'delivery' and ("pickup_address" in request.data or request.data.get("delivery_time", None) is None)):
            return Response({"message": "Please set the appropriate Delivery time in Days"}, status=status.HTTP_400_BAD_REQUEST)  
    
        if (request.data.get("delivery_or_pickup") == 'pickup' and ("delivery_time" in request.data or request.data.get("pickup_address", None) is None)):
            return Response({"message": "Please set the appropriate Pickup Address"}, status=status.HTTP_400_BAD_REQUEST)
        
        if request.data.get("listing_item", None) is None:
            return Response({"message": "Please add items to your listing"}, status=status.HTTP_400_BAD_REQUEST)  
        else:
            for item in request.data.get("listing_item", None):
                if "name" not in item or "description" not in item or "price" not in item or "quantity" not in item or "category" not in item or "image_b64" not in item or "image_name" not in item:
                    return Response({"message": "Item has missing data"}, status=status.HTTP_400_BAD_REQUEST)  

        
        serializer.save(user=user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def listings_update_listing(request, listing_id):
    user = get_authenticated_user(request)
    if not user:
        return Response({"message": "User unidentified."}, status=status.HTTP_401_UNAUTHORIZED)

    listing = get_object_or_404(Listing, id=listing_id, user=user)

    serializer = ListingSerializer(listing, data=request.data, partial=True)
    if serializer.is_valid():
        if request.data.get("delivery_or_pickup", None) is None:
            return Response({"message": "Choose pickup or delivery"}, status=status.HTTP_400_BAD_REQUEST)  
        
        # Validate delivery or pickup option
        if request.data.get("delivery_or_pickup") == 'delivery' and "pickup_address" in request.data:
            return Response({"message": "Pickup address set for delivery option"}, status=status.HTTP_400_BAD_REQUEST)  

        if request.data.get("delivery_or_pickup") == 'pickup' and "delivery_time" in request.data:
            return Response({"message": "Delivery time set for pickup option"}, status=status.HTTP_400_BAD_REQUEST)
        
        if request.data.get("listing_item", None) is None:
            return Response({"message": "Please add items to your listing"}, status=status.HTTP_400_BAD_REQUEST)  
        else:
            for item in request.data.get("listing_item", None):
                if "name" not in item or "description" not in item or "price" not in item or "quantity" not in item or "category" not in item or "image_b64" not in item or "image_name" not in item:
                    return Response({"message": "Item has missing data"}, status=status.HTTP_400_BAD_REQUEST) 
        # Save the updated listing
        serializer.save(user=user)

        # Handle item updates if provided
        items_data = request.data.get('listing_item')
        if items_data:
            existing_item_ids = [item.id for item in listing.listing_item.all()]
            updated_item_ids = []

            for item_data in items_data:
                item_id = item_data.get('id')
                
                if item_id and item_id in existing_item_ids:
                    # Update existing item
                    item = Item.objects.get(id=item_id)
                    imageb64string = item_data.get('image_b64')
                    file_name = item_data.get('image_name')
                    if imageb64string and file_name:
                        image_file = save_base64_image(imageb64string, file_name)
                        item_data['image'] = image_file
                    ItemSerializer().update(item, item_data)
                    updated_item_ids.append(item_id)
                else:
                    # Create new item
                    imageb64string = item_data.get('image_b64')
                    file_name = item_data.get('image_name')
                    if imageb64string and file_name:
                        image_file = save_base64_image(imageb64string, file_name)
                        item_data['image'] = image_file
                    Item.objects.create(listing=listing, **item_data)
            
            # Delete items not in the updated list
            for item_id in existing_item_ids:
                if item_id not in updated_item_ids:
                    Item.objects.filter(id=item_id).delete()

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
    response_data = serializer.data
    for item in response_data['listing_item']:
        item.pop('image_b64')
    
    return Response(response_data, status=status.HTTP_200_OK)

def listings_get_listings(request):
    user = get_authenticated_user(request)
    if not user:
        return Response({"message": "User unidentified."}, status=status.HTTP_401_UNAUTHORIZED)

    listings = Listing.objects.filter(user=user)
    serializer = ListingSerializer(listings, many=True)
    response_data = serializer.data
    for listing in response_data:
        for item in listing['listing_item']:
            item.pop('image_b64')
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