from django.utils import timezone
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.core.validators import MaxValueValidator, MinValueValidator 

ADDRESS_LIMIT = 1500
DEFAULT_ITEM_IMAGE = 'https://cmumarketplace.s3.us-east-2.amazonaws.com/static/full-items-inside-a-shopping-bag.svg'

class CustomUser(AbstractUser):
    """
    Custom user model representing a user in the system.

    This model extends the built-in Django AbstractUser model to customize user
    authentication using email instead of username.

    Attributes:
        name (str): The name of the user.
        email (str): The email address of the user, used for authentication.
        oauth_token (str): The OAuth token associated with the user for external
            service authentication.

    Overrides:
        REQUIRED_FIELDS (list): An empty list, indicating no additional fields
            are required when creating a user via the createsuperuser management
            command.
        USERNAME_FIELD (str): Specifies the email field as the unique identifier
            for authentication purposes.
        EMAIL_FIELD (str): Specifies the name of the field in the model that
            represents the email address.

    """
    username = None
    password = None
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    oauth_token = models.CharField(max_length=255)

    REQUIRED_FIELDS = []
    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'
    
    def __str__(self):
        return f'User(name={self.name}, email={self.email})'
    
class UserProfile(models.Model):
    """
    Model representing additional profile information for a user.

    Attributes:
        user (CustomUser): The user associated with this profile.
        profile_picture (str, optional): URL to the user's profile picture.
        address (str, optional): The user's address.
        mobile (str, optional): The user's mobile number.
        email_contact (str, optional): The user's alternative email contact.
    """
    user = models.ForeignKey(CustomUser, on_delete = models.CASCADE, related_name= 'user_profile')
    profile_picture = models.URLField(blank = True, null = True)
    address = models.CharField(max_length=ADDRESS_LIMIT, blank = True, null = True,)
    mobile = models.CharField(max_length=10, blank= True, null = True)
    email_contact = models.EmailField(null=True, blank=True)

    def __str__(self):
        return f'User (email = {self.user.email})'

class Item(models.Model):
    """
    Model representing an item listing in the system.

    This model stores information about an item listed by a user for sale on Tartan Mart.

    Attributes:
        user (CustomUser): The user who listed the item.
        name (str): The name of the item.
        description (str): A detailed description of the item.
        price (Decimal): The price of the item.
        listed_date (DateTime): The date and time when the item was listed.
        sold_date (DateTime, optional): The date and time when the item was sold.
        quantity (int): The quantity of the item available for sale.
        delivery_or_pickup (str): The delivery method for the item (delivery or pickup).
        current_status (str): The current status of the item listing.
        category (str): The category of the item.
        delivery_time (int, optional): The estimated delivery time for the item.
        pickup_address (str, optional): The pickup address for the item (if pickup option is selected).
        image (ImageField, optional): An image of the item.
        image_url (URLField, optional): A URL to an image of the item.

    """
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name= 'item_listing')
    name = models.CharField(max_length=255, blank=False, null=False)
    description = models.TextField(blank=False, null=False)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=False, null=False)
    listed_date = models.DateTimeField(default=timezone.now)
    sold_date = models.DateTimeField(null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1), MaxValueValidator(100)])
    delivery_or_pickup = models.CharField(max_length=20, choices=[('delivery', 'Delivery'), ('pickup', 'Pickup')], default='pickup')
    CURRENT_STATUS_CHOICES = (
        ('listed', 'Listed'),
        ('sold', 'Sold'),
        ('deleted', 'Deleted'),
    )
    current_status = models.CharField(max_length=20, choices=CURRENT_STATUS_CHOICES, default='listed')
    CATEGORY_CHOICES = (
        ('electronics', 'Electronics'),
        # ('textbooks', 'Textbooks'),
        ('furniture', 'Furniture'),
        ('clothing', 'Clothing'),
        ('home', 'Home'),
        ('beauty', 'Beauty'),
        # ('toys', 'Toys'),
        ('other', 'Other'),
    )
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES, default='clothing')
    delivery_time = models.PositiveIntegerField(null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(30)])
    pickup_address = models.CharField(max_length=ADDRESS_LIMIT, null=True, blank=True)
    image = models.ImageField(upload_to="images/", blank=True, null=True, default=DEFAULT_ITEM_IMAGE)
    image_url = models.URLField(null=True, blank=True)
    def __str__(self):
        return f'Item - {self.name}, Qty - {self.quantity}'
    
class Order(models.Model):
    """
    Model representing an order placed by a user.
    Attributes:
        buyer (CustomUser): The user who placed the order.
        items (ManyToManyField): The items included in the order, linked through the OrderItem model.
        total_price (Decimal, optional): The total price of the order.
        payment_status (str): The payment status of the order.
        order_date (DateTime): The date and time when the order was placed.
        checkout_id (str): The ID associated with the checkout process for the order.
        delivery_address (str): The delivery address for the order.
    """
    buyer = models.ForeignKey(CustomUser, on_delete=models.PROTECT)
    items = models.ManyToManyField(Item, through='OrderItem')
    total_price = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    payment_status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('completed', 'Completed'), ('failed', 'Failed')])
    order_date = models.DateTimeField(auto_now_add=True)
    checkout_id = models.CharField(max_length=50000)
    delivery_address = models.CharField(max_length= ADDRESS_LIMIT)

    def __str__(self):
        return f"Order {self.id} - Buyer: {self.buyer.name}, Total Price: {self.total_price}, Payment Status: {self.payment_status}, Checkout ID: {self.checkout_id}"
    
class OrderItem(models.Model):
    """
    Model representing an item included in an order.
    Attributes:
        order (Order): The order to which this item belongs.
        item (Item): The item included in the order.
        quantity (int, optional): The quantity of the item ordered.

    """

    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(null=True, validators=[MinValueValidator(1), MaxValueValidator(100)])

    def increase_item_quantity(self):
        """
        Increases the quantity of the associated item
            and sets its current status to 'listed'.
        """
        self.item.quantity += self.quantity
        self.item.current_status = 'listed'
        self.item.save()

    def __str__(self):
        """
         Returns a string representation of the OrderItem instance,
            including the order ID, item name, and quantity.
        """
        return f"Order {self.order.id} - Item: {self.item.name}, Quantity: {self.quantity}"