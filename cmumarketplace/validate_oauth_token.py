import requests
import json
from configparser import ConfigParser

def get_oauth_token_details(token):
    api_url = f'https://oauth2.googleapis.com/tokeninfo?id_token={token}'
    response = requests.get(api_url)
    return response.json()

def validate_token_details(response_json: requests.Response):
    if 'error' in response_json:
        return False
    if response_json['iss'] not in ['https://accounts.google.com', 'accounts.google.com']:
        return False
    if response_json['hd'] != 'andrew.cmu.edu':
        return False
    if ("email" not in response_json) or ("name") not in response_json:
        return False

    CONFIG = ConfigParser()
    CONFIG.read("config.ini")
    CLIENT_ID = CONFIG.get("Google", "client_id")
    if response_json['aud'] != CLIENT_ID:
        return False
    
    return True
    