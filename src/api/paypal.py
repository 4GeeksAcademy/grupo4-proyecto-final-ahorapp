import os
import requests
from flask import Blueprint, request, jsonify

paypal = Blueprint("paypal", __name__)

CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID")
SECRET = os.getenv("PAYPAL_SECRET")
BASE_URL = os.getenv("PAYPAL_BASE_URL")

def get_access_token():
    response = requests.post(
        f"{BASE_URL}/v1/oauth2/token",
        headers={"Accept": "application/json"},
        auth=(CLIENT_ID, SECRET),
        data={"grant_type": "client_credentials"},
    )
    return response.json()["access_token"]

@paypal.route("/create-order", methods=["POST"])
def create_order():
    access_token = get_access_token()
    body = {
        "intent": "CAPTURE",
        "purchase_units": [{"amount": {"currency_code": "USD", "value": "10.00"}}],
    }

    response = requests.post(
        f"{BASE_URL}/v2/checkout/orders",
        json=body,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}",
        },
    )
    return jsonify(response.json())

@paypal.route("/capture-order/<order_id>", methods=["POST"])
def capture_order(order_id):
    access_token = get_access_token()
    response = requests.post(
        f"{BASE_URL}/v2/checkout/orders/{order_id}/capture",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    return jsonify(response.json())
