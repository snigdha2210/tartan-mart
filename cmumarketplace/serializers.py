from rest_framework import serializers
from .models import Item, Listing, UserProfile
import base64
import uuid
from django.core.files.base import ContentFile

class TokenSerializer(serializers.Serializer):
    """ JWT Token Serializer """
    credential = serializers.CharField()

class ProfileSerializer(serializers.ModelSerializer):
    """ User Profile Serializer """
    owner = serializers.ReadOnlyField(source='user.email')
    class Meta:
        model = UserProfile
        fields = ['id', 'owner', 'address', 'mobile', 'email_contact', 'profile_picture']

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'name', 'description', 'price', 'quantity', 'category', 'image', 'image_b64', 'image_name', 'current_status']

class ListingSerializer(serializers.ModelSerializer):
    listing_item = ItemSerializer(many=True)

    class Meta:
        model = Listing
        fields = ['id', 'name', 'delivery_or_pickup', 'delivery_time', 'pickup_address', 'listing_item', 'created_date', 'updated_date']
    
    def create(self, validated_data):
        try:
            items_data = validated_data.pop('listing_item')
            listing = Listing.objects.create(**validated_data)
            for item_data in items_data:
                print('item data:', item_data)
                imageb64string = item_data['image_b64']
                file_name = item_data['image_name']
                image_file = save_base64_image(imageb64string, file_name)
                item_data['image'] = image_file
                Item.objects.create(listing=listing, **item_data)
            return listing
        except Exception as e:
            raise serializers.ValidationError({"message": "Image malformed"})
    
    def update(self, instance, validated_data):
        try:
            # Update the Listing fields
            instance.name = validated_data.get('name', instance.name)
            instance.description = validated_data.get('description', instance.description)
            instance.delivery_or_pickup = validated_data.get('delivery_or_pickup', instance.delivery_or_pickup)
            instance.delivery_time = validated_data.get('delivery_time', instance.delivery_time)
            instance.pickup_address = validated_data.get('pickup_address', instance.pickup_address)
            instance.save()

            # Handle updating nested Item instances
            items_data = validated_data.pop('listing_item')
            existing_items = {item.id: item for item in instance.listing_item.all()}

            for item_data in items_data:
                item_id = item_data.get('id')

                if item_id in existing_items:
                    # If the item exists, update it
                    item = existing_items.pop(item_id)
                    imageb64string = item_data.get('image_b64')
                    file_name = item_data.get('image_name')
                    if imageb64string and file_name:
                        image_file = save_base64_image(imageb64string, file_name)
                        item_data['image'] = image_file
                    ItemSerializer().update(item, item_data)
                else:
                    # If the item is new, create it
                    imageb64string = item_data.get('image_b64')
                    file_name = item_data.get('image_name')
                    if imageb64string and file_name:
                        image_file = save_base64_image(imageb64string, file_name)
                        item_data['image'] = image_file
                    Item.objects.create(listing=instance, **item_data)

            # Delete any items that were not included in the update
            for item in existing_items.values():
                item.delete()

            return instance
        except Exception as e:
            raise serializers.ValidationError({"message": f"Error updating listing data: {e}"})
    

def save_base64_image(base64_string, file_name):
    """
    This function saves a base64 encoded string as an image to an Item model instance.

    :param base64_string: The base64 encoded image string
    :param item_name: The name of the item to associate the image with
    :return: The created item with the saved image
    """
    format, imgstr = base64_string.split(';base64,')  # Split the base64 string
    ext = format.split('/')[-1]  # Extract the file extension (e.g., jpg, png)
    
    # Create a file name using UUID to avoid name collisions
    # file_name = f"{file_name}"

    # Decode the base64 string into binary data
    image_data = ContentFile(base64.b64decode(imgstr), name=file_name)

    # Create the Item instance and associate the image
    # item = Item.objects.create(name=item_name)
    # item.image.save(file_name, image_data, save=True)  # Save the image to the ImageField

    return image_data
    



