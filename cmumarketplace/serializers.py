from rest_framework import serializers
from .models import Item, UserProfile, Order, OrderItem

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
    """ Item Serializer """
    owner = serializers.ReadOnlyField(source='user.email')
    image = serializers.ImageField(required=False, use_url=True)
    class Meta:
        model = Item
        fields = ['id', 'owner', 'name', 'description', 'price', 'quantity', 'listed_date', 'current_status', 'category', 'delivery_or_pickup', 'pickup_address', 'delivery_time', 'image']

class OrderSerializer(serializers.ModelSerializer):
    """ Order Serializer: This serializer converts Order model instances into JSON representation
    and vice versa. """
    owner = serializers.ReadOnlyField(source='user.email')
    items = ItemSerializer(many=True, read_only=True)
    class Meta:
        model = Order
        fields = ['id', 'owner', 'items', 'total_price', 'payment_status', 'order_date', 'checkout_id', 'delivery_address']

class OrderItemSerializer(serializers.ModelSerializer):
    """
    Serializer for the OrderItem model.

    This serializer converts OrderItem model instances into JSON representation
    and vice versa.

    """
    order = OrderSerializer()
    item = ItemSerializer()
    class Meta:
        model = OrderItem
        fields = ['id', 'item', 'order', 'quantity']


class ODItemSerializer(serializers.ModelSerializer):
    """
    Serializer for the Order Detail Item page data.

    This serializer converts Order Detail Item page data instances into JSON representation
    and vice versa.

    """
    class Meta:
        model = Item
        fields = ['image']

class ODOrderItemSerializer(serializers.ModelSerializer):
    item_name = serializers.ReadOnlyField(source='item.name')
    quantity = serializers.IntegerField()
    item_image = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderItem
        fields = ['item_name', 'quantity', 'item_image']
    
    def get_item_image(self, obj):
        return obj.item.image.url if obj.item.image else None

class ODOrderSerializer(serializers.ModelSerializer):
    items = ODOrderItemSerializer(source='orderitem_set', many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'total_price', 'payment_status', 'order_date', 'delivery_address', 'items']

    

# class PurchasedItemSerializer(serializers.ModelSerializer):
#     item = ItemSerializer
#     class Meta:
#         model = PurchasedItem
#         fields = ['id', 'item', 'quantity', 'delivery_or_pickup', 'delivery_address']

# class OrderSerializer(serializers.ModelSerializer):
#     owner = serializers.ReadOnlyField(source='user.email')
#     items = PurchasedItemSerializer(many=True, read_only=True)
#     class Meta:
#         model = Order
#         fields = ['id', 'owner', 'items', 'order_date', 'payment_status', 'delivery_or_pickup', 'delivery_address']

