from flask import jsonify, url_for
from datetime import datetime, timezone
from .models import User
import requests
import os

# paypal configuration
PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID")
PAYPAL_SECRET = os.getenv("PAYPAL_SECRET")
PAYPAL_BASE_URL = os.getenv("PAYPAL_BASE_URL")

class APIException(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv

def has_no_empty_params(rule):
    defaults = rule.defaults if rule.defaults is not None else ()
    arguments = rule.arguments if rule.arguments is not None else ()
    return len(defaults) >= len(arguments)

def generate_sitemap(app):
    links = ['/admin/']
    for rule in app.url_map.iter_rules():
        # Filter out rules we can't navigate to in a browser
        # and rules that require parameters
        if "GET" in rule.methods and has_no_empty_params(rule):
            url = url_for(rule.endpoint, **(rule.defaults or {}))
            if "/admin/" not in url:
                links.append(url)

    links_html = "".join(["<li><a href='" + y + "'>" + y + "</a></li>" for y in links])
    return """
        <div style="text-align: center;">
        <img style="max-height: 80px" src='https://storage.googleapis.com/breathecode/boilerplates/rigo-baby.jpeg' />
        <h1>Rigo welcomes you to your API!!</h1>
        <p>API HOST: <script>document.write('<input style="padding: 5px; width: 300px" type="text" value="'+window.location.href+'" />');</script></p>
        <p>Start working on your project by following the <a href="https://start.4geeksacademy.com/starters/full-stack" target="_blank">Quick Start</a></p>
        <p>Remember to specify a real endpoint path like: </p>
        <ul style="text-align: left;">"""+links_html+"</ul></div>"


def validate_relationships(relaciones):
    for nombre, (modelo, valor_id) in relaciones.items():
        if not modelo.query.get(valor_id):
            return jsonify({"msg": f"No existe la {nombre.lower()}"}), 404
    return None


def validate_required_fields(campos):
    campos_faltantes = [campo for campo, valor in campos.items() if not valor]
    if campos_faltantes:
        return jsonify({"msg": f"Todos los datos son obligatorios: {', '.join(campos_faltantes)}"}), 400
    return None

def parse_date(value: str, default: datetime) -> datetime:
    try:
        return datetime.strptime(value, "%Y-%m-%d").replace(tzinfo=timezone.utc)
    except (TypeError, ValueError):
        return default

def check_user_is_admin(user_id):
        
    user = User.query.filter_by(id=user_id).first()

    if user.role != 'admin':
        return jsonify({"msg": "Debe ser administrador para poder acceder a este ruta"}), 401
        
    return None

def get_access_token():
    auth = (PAYPAL_CLIENT_ID, PAYPAL_SECRET)

    headers = {
        "Accept": "application/json",
        "Accept-Language": "en_US",
    }

    data = {
        "grant_type": "client_credentials"
    }

    response = requests.post(
        f"{PAYPAL_BASE_URL}/v1/oauth2/token",
        headers=headers,
        data=data,
        auth=auth
    )

    return response.json()["access_token"]