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
    user = models.ForeignKey(to=CustomUser, on_delete = models.CASCADE, related_name= 'user_profile')
    profile_picture = models.URLField(blank = True, null = True)
    address = models.CharField(max_length=ADDRESS_LIMIT, blank = True, null = True,)
    mobile = models.CharField(max_length=10, blank= True, null = True)
    email_contact = models.EmailField(null=True, blank=True)

    def __str__(self):
        return f'User (email = {self.user.email})'
    
class Listing(models.Model):
    """
    Model representing a listing in the system.

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
    user = models.ForeignKey(to=CustomUser, on_delete=models.CASCADE, related_name= 'user_listing')
    name = models.CharField(max_length=255, blank=False, null=False)
    description = models.TextField(blank=False, null=False)
    created_date = models.DateTimeField(default=timezone.now)
    updated_date = models.DateTimeField(null=True, blank=True)
    delivery_or_pickup = models.CharField(max_length=20, choices=[('delivery', 'Delivery'), ('pickup', 'Pickup')], default='pickup')
    CURRENT_STATUS_CHOICES = (
        ('listed', 'Listed'),
        ('delisted', 'Delisted'),
        ('deleted', 'Deleted'),
    )
    current_status = models.CharField(max_length=20, choices=CURRENT_STATUS_CHOICES, default='listed')
    delivery_time = models.PositiveIntegerField(null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(30)])
    pickup_address = models.CharField(max_length=ADDRESS_LIMIT, null=True, blank=True)
    
    def __str__(self):
        return f'Listing - {self.name}, Created by - {self.user}'

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
    listing = models.ForeignKey(to=Listing, on_delete=models.CASCADE, related_name='listing_item')
    name = models.CharField(max_length=255, blank=False, null=False)
    description = models.TextField(blank=False, null=False)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=False, null=False)
    quantity = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1), MaxValueValidator(100)])
    CATEGORY_CHOICES = (
        ('electronics', 'Electronics'),
        ('furniture', 'Furniture'),
        ('clothing', 'Clothing'),
        ('home', 'Home'),
        ('beauty', 'Beauty'),
        ('other', 'Other'),
        ('none', 'None')
    )
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES, default='none')

    listed_date = models.DateTimeField(default=timezone.now)
    sold_date = models.DateTimeField(null=True, blank=True)
    
    CURRENT_STATUS_CHOICES = (
        ('listed', 'Listed'),
        ('delisted', 'Delisted'),
        ('deleted', 'Deleted'),
    )
    current_status = models.CharField(max_length=20, choices=CURRENT_STATUS_CHOICES, default='listed')

    image = models.ImageField(upload_to="images/", blank=True, null=True, default=DEFAULT_ITEM_IMAGE)
    image_b64 = models.CharField(max_length=9999999999, null=True, blank=True)
    image_url = models.URLField(null=True, blank=True)
    image_name = models.CharField(max_length=9999, null=True, blank=True)
    
    def __str__(self):
        return f'Item - {self.name}, Qty - {self.quantity}'