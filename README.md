# TartanMart

### Project Overview

TartanMart is a dynamic web application designed to facilitate a student-friendly platform for buying and selling items among students at CMU. It aims to offer a convenient, economical, and efficient method for students to find school-specific items, often at reduced prices and with faster delivery or pickup options.

### Key Features:

- **Homepage**: Features a Hero Section and product categories.
- **Listings Page**: Displays all products with integrated search functionality.
- **Login and Sign Up Pages**: Secure user authentication.
- **Item Listing Page**: Allows users to post items for sale.
- **Item Detail Page**: Provides detailed information about items.
- **Payment Flow**: Secure transaction process for item purchases.
- **User Profile Page**: Includes settings for account personalization and tabs for active and archived listings.

### Technologies:

- **Frontend**: React.js - Chosen for its robust ecosystem and the ability to build dynamic user interfaces efficiently.
- **Backend**: Django - Utilized for its excellent capability to handle data and provide secure, scalable back-end services.

## Team Members

- Jainam Gala (jgala)
- Sanah Imani (simani)
- Snigdha Tiwari (snigdhat)

## Setup and Installation

### Prerequisites:

- Node.js and npm
- Python 3.x
- Pipenv or virtualenv (for Python dependency management)

### Getting Started:

1. Clone the Repository:

   ```
   git clone https://github.com/cmu-webapps/s24_team_26.git
   cd s24_team_26
   ```

2. Activate the virtual environment:

   ```
   python -m venv env
   source env/bin/activate
   ```

3. Setup for Backend:

   ```
   pip3 install -r requirements.txt
   python3 manage.py makemigrations
   python3 manage.py migrate
   python3 manage.py runserver
   ```

4. Set Up the Frontend:

   ```
   cd frontend
   npm i
   npm run dev
   ```

5. Access the Application:

- Open a web browser and navigate to http://localhost:5713 for the frontend.
- Access the Django API via http://localhost:8000.

###### References: {https://stackoverflow.com/questions/18676156/how-to-properly-use-the-choices-field-option-in-django,https://docs.allauth.org/en/latest/installation/quickstart.html,https://docs.stripe.com/checkout/quickstart?client=react&lang=python,https://mui.com/material-ui/api/typography/, https://docs.djangoproject.com/en/5.0/topics/auth/customizing/, https://docs.djangoproject.com/en/5.0/ref/class-based-views/, https://react-redux.js.org/api/hooks, https://reactrouter.com/en/main/hooks/use-navigate, https://reactrouter.com/en/main/hooks/use-location}
