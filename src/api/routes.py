"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from datetime import timedelta

api = Blueprint('api', __name__)

bcrypt = Bcrypt()

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/signup', methods=['POST'])
def signup_user():

    name = request.json.get('name')
    email = request.json.get('email')
    password = request.json.get('password')


    if not name or not email or not password:
        return jsonify({'msg': 'Datos incompletos, por favor llenar todos los datos del usuario'}), 400
    

    user = User.query.filter_by(email = email).first()

    if user:
        return jsonify({'msg' : 'El email utilizado ya esta registrado, por favor utilizar otro'}), 400
    
    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')


    new_user = User(name = name, password = password_hash, email = email)

    db.session.add(new_user)
    db.session.commit()


    return jsonify(new_user.serialize()), 201

@api.route('/login', methods=['POST'])
def login():
   
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
       
        return jsonify({'message': 'Correo y contraseña son obligatorios'}), 400

    user = User.query.filter_by(email=email).first()
    

    if not user: 
        return jsonify({"message":"usuario no encontrado"}), 404
       
    password_db = user.password 
        
    true_false= bcrypt.check_password_hash(password_db,password)
    if true_false: 
        expires= timedelta(days=1)
        user_id=user.id
        access_token=create_access_token(identity=str(user_id),expires_delta=expires)
        return jsonify({
                "messagge": "Logueado exitosamente",
                "access_token": access_token
            }), 200
    else:
        return jsonify({
            "messagge": "contraseña incorrecta"
        }), 400