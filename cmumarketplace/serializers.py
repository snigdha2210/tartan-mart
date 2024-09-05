from rest_framework import serializers
from .models import Item, Listing, UserProfile

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
        fields = ['id', 'name', 'description', 'price', 'quantity', 'category', 'image']

class ListingSerializer(serializers.ModelSerializer):
    listing_item = ItemSerializer(many=True)

    class Meta:
        model = Listing
        fields = ['id', 'name', 'description', 'delivery_or_pickup', 'delivery_time', 'pickup_address', 'listing_item']

    def create(self, validated_data):
        items_data = validated_data.pop('listing_item')
        listing = Listing.objects.create(**validated_data)
        for item_data in items_data:
            Item.objects.create(listing=listing, **item_data)
        return listing


