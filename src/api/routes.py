"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""

from flask import Flask, request, jsonify, url_for, Blueprint
import os
from api.models import db, User, Record, Category, Wallet, Goal, Currency
from api.utils import generate_sitemap, APIException, validate_relationships, validate_required_fields, parse_date, check_user_is_admin, get_access_token, parse_record_input, categorize_with_ai
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from twilio.rest import Client
from .categories_dict import categories
from datetime import timedelta, timezone, datetime
import requests

api = Blueprint("api", __name__)

bcrypt = Bcrypt()


# Allow CORS requests to this API
CORS(api)

# paypal configuration
PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID")
PAYPAL_SECRET = os.getenv("PAYPAL_SECRET")
PAYPAL_BASE_URL = os.getenv("PAYPAL_BASE_URL")
PAYPAL_RETURN_URL = os.getenv("PAYPAL_RETURN_URL")
PAYPAL_CANCEL_URL = os.getenv("PAYPAL_CANCEL_URL")

# TWILIO CONFIGURATION
TWILIO_SID=os.getenv("TWILIO_SID")
TWILIO_TOKEN=os.getenv("TWILIO_TOKEN")
TWILIO_NUMBER=os.getenv("TWILIO_WPP_NUMBER")

twilio_client = Client(TWILIO_SID, TWILIO_TOKEN)

@api.route("/hello", methods=["POST", "GET"])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


# Registrar nuevo usuario
@api.route("/signup", methods=["POST"])
def signup_user():

    try:
        name = request.json.get("name")
        email = request.json.get("email")
        password = request.json.get("password")
        role = request.json.get("role")

        if not name or not email or not password:
            return (
                jsonify(
                    {
                        "msg": "Datos incompletos, por favor llenar todos los datos del usuario"
                    }
                ),
                400,
            )

        if role:
            if role != "user" and role != "admin":
                return jsonify({"msg": "No se pudo asignar el role"}), 400

        user = User.query.filter_by(email=email).first()

        if user:
            return (
                jsonify(
                    {
                        "msg": "El email utilizado ya esta registrado, por favor utilizar otro"
                    }
                ),
                400,
            )

        password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

        new_user = User(name=name, password=password_hash, email=email, role=role)
        
        db.session.add(new_user)
        db.session.flush()
        
        new_wallet_user = Wallet(name=name, total_value=0, currency_id=1, user_id=new_user.id)
        db.session.add(new_wallet_user)
        
        db.session.commit()

        return jsonify(new_user.serialize()), 201
    except Exception as e:
        return jsonify({"msg": f"El siguiente error acaba de ocurrir: {e}"}), 500


# Login
@api.route("/login", methods=["POST"])
def login():

    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:

        return jsonify({"message": "Correo y contraseña son obligatorios"}), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"message": "usuario no encontrado"}), 404

    password_db = user.password

    true_false = bcrypt.check_password_hash(password_db, password)
    if true_false:
        expires = timedelta(days=1)
        user_id = user.id
        user_role = user.role

        access_token = create_access_token(
            identity=str(user_id),
            expires_delta=expires,
            additional_claims={"role": user_role},
        )

        user.last_login = datetime.now(timezone.utc)
        db.session.commit()

        return (
            jsonify(
                {"messagge": "Logueado exitosamente", "access_token": access_token, "logged_user_wallets": [w.id for w in user.wallets]}
            ),
            200,
        )
    else:
        return jsonify({"messagge": "contraseña incorrecta"}), 400


# Ruta creada para añadir una nueva wallet a la cuenta del usuario


@api.route("/wallet/add", methods=["POST"])
@jwt_required()
def create_wallet():

    try:

        user_id = get_jwt_identity()
        name_wallet = request.json.get('name')
        initial_value = request.json.get('total_value')
        currency_id = request.json.get('currency_id')

        currency = Currency.query.filter_by(id = currency_id).first()

        if not currency:
            return jsonify({'msg': 'Ese moneda no existe, debe crearse o agregar una que exista'}), 400


        # hacer verificacaciones para asegurar de que se incluya los 4 items de arriba
        if not name_wallet or initial_value == None or not currency_id:
            return jsonify({'msg': 'Por favor completar todos los campos'}), 400
        
        # Verifica si el usuario no existe
        user = User.query.filter_by(id = user_id).first()
        if not user:
            return jsonify({'msg': 'Este usuario no existe'}), 400
        
        all_wallets = list(Wallet.query.filter_by(user_id = user_id).all())

        # Condicion pars verificar que el usuario no es premium y si tiene mas de 2 wallets creadas, llego a si lumite de prueba
        if not user.is_premium and len(all_wallets) >= 2:
            return jsonify({'msg': 'El usuario es Free y ya tiene mas de 2 wallets creadas'}), 403
        
        # Si cumple, que se cree el wallet con la clase Wallet
        wallet = Wallet.query.filter_by( name = name_wallet ,user_id = user_id).first()

        if wallet:
            return jsonify({'msg': 'Este nombre de wallet ya esta registrado en tu cuenta'}),400
        
        new_wallet = Wallet(name = name_wallet, total_value = initial_value, currency_id = currency_id, user_id = user_id)

        db.session.add(new_wallet)
        db.session.commit()

        return jsonify(new_wallet.serialize()), 201

    except Exception as e:
        return jsonify({"msg": f"El siguiente error acaba de ocurrir: {e}"}), 500


# Ruta para obtener todas las wallets registradas en la app (funcion solo para admin)
@api.route("/wallet/all", methods=["GET"])
@jwt_required()
def get_wallets():

    try:

        is_not_admin = check_user_is_admin(get_jwt_identity())

        if is_not_admin:
            return is_not_admin

        all_wallets = Wallet.query.all()

        if not all_wallets:
            return jsonify({"msg": "No hay wallets registradas"}), 400

        dict_wallets = list(map(lambda x: x.serialize(), all_wallets))

        return jsonify(dict_wallets)
    except Exception as e:
        return jsonify({"msg": f"El siguiente error acaba de ocurrir: {e}"}), 500


# Ruta para obtener todas las wallets por user_id
@api.route("/wallet/get", methods=["GET"])
@jwt_required()
def get_wallets_by_user_id():

    try:
        user_id = get_jwt_identity()

        wallets_by_user = Wallet.query.filter_by(user_id=user_id)

        if not wallets_by_user:
            return jsonify({"msg": "No existen wallets registrados a ese usuario"}), 400

        wallets_by_user = list(map(lambda wallet: wallet.serialize(), wallets_by_user))

        return jsonify(wallets_by_user)
    except Exception as e:
        return jsonify({"msg": f"El siguiente error acaba de ocurrir: {e}"}), 500


# Crear Ruta GET para obtener la wallet por ID
@api.route("/wallet/get/<int:wallet_id>", methods=["GET"])
@jwt_required()
def get_wallet_from_user(wallet_id):

    try:
        user_id = get_jwt_identity()
        user = User.query.filter_by(id=user_id).first()

        if not user:
            return jsonify({"message": "usuario no encontrado"}), 404

        wallet_from_user = Wallet.query.filter_by(user_id=user_id, id=wallet_id).first()

        if not wallet_from_user:
            return jsonify({"msg": "No existe ese wallet del usuario"}), 404

        return jsonify(wallet_from_user.serialize())

    except Exception as e:
        return jsonify({"msg": f"El siguiente error acaba de ocurrir: {e}"}), 500


# Ruta PUT para modificar el wallet
@api.route("/wallet/edit/<int:wallet_id>", methods=["PUT"])
@jwt_required()
def modify_wallet(wallet_id):

    try:
        name_wallet = request.json.get("name")
        initial_value = request.json.get("total_value")
        currency_id = request.json.get("currency_id")

        user_id = get_jwt_identity()
        user = User.query.filter_by(id=user_id).first()

        if not user:
            return jsonify({"message": "usuario no encontrado"}), 404

        wallet_from_user = Wallet.query.filter_by(user_id=user_id, id=wallet_id).first()

        if not wallet_from_user:
            return jsonify({"msg": "No existe ese wallet del usuario"}), 404

        if name_wallet:
            wallet_from_user.name = name_wallet

        if initial_value:
            wallet_from_user.total_value = initial_value

        if currency_id:
            wallet_from_user.currency_id = currency_id

        db.session.commit()

        return jsonify(wallet_from_user.serialize()), 201
    except Exception as e:
        return jsonify({"msg": f"El siguiente error acaba de ocurrir: {e}"}), 500


@api.route("/wallet/delete/<int:wallet_id>", methods=["DELETE"])
@jwt_required()
def delete_wallet(wallet_id):

    try:
        user_id = get_jwt_identity()
        user = User.query.filter_by(id=user_id).first()

        if not user:
            return jsonify({"message": "usuario no encontrado"}), 404

        wallet_from_user = Wallet.query.filter_by(user_id=user_id, id=wallet_id).first()

        if not wallet_from_user:
            return jsonify({"msg": "No existe ese wallet del usuario"}), 404

        db.session.delete(wallet_from_user)
        db.session.commit()

        return jsonify({"msg": "Wallet eliminada con exito"})
    except Exception as e:
        return jsonify({"msg": f"El siguiente error acaba de ocurrir: {e}"}), 500


# Crea un nuevo registro
@api.route("/records/add", methods=["POST"])
@jwt_required()
def add_record():

    try:

        fields = request.get_json()
        user_id = get_jwt_identity()

        if not user_id:
            return (
                jsonify({"msg": "Debe estar logueado para agregar un registro."}),
                401,
            )

        required_fields = {
            "description": fields.get("description"),
            "amount": fields.get("amount"),
            "type": fields.get("type"),
            # "category_name": fields.get("category_name", "General"),
            "wallet_id": fields.get("wallet_id"),
        }
        

        error_fields = validate_required_fields(required_fields)
        if error_fields:
            return error_fields
        
        if fields["type"] not in ["Ingreso", "Gasto"]:
            return jsonify({"msg": "El campo 'type' debe ser 'Ingreso' o 'Gasto'."}), 400

        error_relationships = validate_relationships(
            {"Wallet": (Wallet, fields.get("wallet_id"))}
        )
        if error_relationships:
            return error_relationships

        category = Category.query.filter_by(name=categorize_with_ai(fields["description"])).first()
        
        if not category:
            category = Category.query.filter_by(name="General").first()
            if not category:
                category = Category(name="General", description="Categoria por defecto")
                db.session.add(category)
                db.session.flush()
                

        new_record = Record(
            description=fields["description"],
            amount=fields["amount"],
            type=fields["type"],
            category_id=category.id,
            wallet_id=fields["wallet_id"],
            user_id=user_id,
        )
        
        wallet = Wallet.query.filter_by(id=fields.get("wallet_id"), user_id=user_id).first()
        wallet.total_value += fields['amount']

        db.session.add(new_record)
                
        db.session.commit()

        return jsonify(new_record.serialize()), 201

    except Exception as e:
        return jsonify({"msg": f"El siguiente error acaba de ocurrir: {e}"}), 500


# Lista todos los registros del usuario logueado, lo puede filtrar por Categoria y/o Fecha de inicio
@api.route("/records/list", methods=["GET"])
@jwt_required()
def get_records():

    try:

        user_id = get_jwt_identity()

        category_id = request.args.get("category_id", type=int, default=None)
        wallet_id = request.args.get('wallet_id', type=int, default=None)
        start_date = parse_date(
            request.args.get("start_date"), datetime(2025, 1, 1, tzinfo=timezone.utc)
        )
        end_date = parse_date(request.args.get("end_date"), datetime.now(timezone.utc))

        query = Record.query.filter(Record.user_id == user_id)

        if category_id:
            query = query.filter(Record.category_id == category_id)
        if start_date:
            query = query.filter(Record.timestamp >= start_date)
        if end_date:
            query = query.filter(Record.timestamp <= end_date)
        if wallet_id:
            query = query.filter(Record.wallet_id == wallet_id)
            

        records = query.all()

        if category_id and not records:
            return (
                jsonify({"msg": "No hay registros para la categoria solicitada"}),
                404,
            )

        return jsonify({"records": [record.serialize() for record in records]}), 200

    except Exception as e:
        return jsonify({"msg": f"El siguiente error acaba de ocurrir: {e}"}), 500


# Muestra la info de un registro especifico segun el id que viene ne la URL
@api.route("/records/<int:id>", methods=["GET"])
@jwt_required()
def get_record(id):

    try:
        user_id = get_jwt_identity()
        record = Record.query.filter_by(id=id, user_id=user_id).first()

        if not record:
            return jsonify({"msg": "No se encuentra el registro solicitado"}), 404

        return jsonify(record.serialize()), 200

    except Exception as e:
        return jsonify({"msg": f"El siguiente error acaba de ocurrir: {e}"}), 500


# Edita la info de un registro especifico segun el id que viene ne la URL
@api.route("/records/edit/<int:id>", methods=["PUT"])
@jwt_required()
def edit_record(id):

    try:
        user_id = get_jwt_identity()
        record = Record.query.filter_by(id=id, user_id=user_id).first()

        data = request.get_json()

        if not record:
            return jsonify({"msg": "No se encuentra el registro solicitado"}), 404

        if "description" in data and data['description'] is not None:
            record.description = data["description"]
        if "amount" in data and data['amount'] is not None:
            record.amount = data["amount"]
        if "type" in data and data['type'] is not None:
            record.type = data["type"]
        if "category_id" in data and data['category_id'] is not None:
            record.category_id = data["category_id"]

        db.session.commit()

        return jsonify(record.serialize()), 200

    except Exception as e:
        return jsonify({"msg": f"El siguiente error acaba de ocurrir: {e}"}), 500


# Elimina un registro especifico segun el id que viene ne la URL
@api.route("/records/delete/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_record(id):

    try:
        user_id = get_jwt_identity()
        record = Record.query.filter_by(id=id, user_id=user_id).first()

        if not record:
            return jsonify({"msg": "No se encuentra el registro solicitado"}), 404

        db.session.delete(record)
        db.session.commit()

        return jsonify({"msg": "Registro eliminado exitosamente"}), 200

    except Exception as e:
        return jsonify({"msg": f"El siguiente error acaba de ocurrir: {e}"}), 500


# Crea una nueva categoria
@api.route("/categories/add", methods=["POST"])
@jwt_required()
def create_category():
    try:
        is_admin = check_user_is_admin(get_jwt_identity())
        if is_admin:
            return is_admin

        data = request.get_json()

        if "name" not in data or "description" not in data:
            return jsonify({"msg": "Todos los campos son obligatorios"}), 400

        category = Category.query.filter_by(name=data["name"]).first()

        if category:
            return (
                jsonify(
                    {
                        "msg": "Ya existe una categoria con este nombre, intente con uno diferente"
                    }
                ),
                400,
            )

        new_category = Category(name=data["name"], description=data["description"])
        db.session.add(new_category)
        db.session.commit()

        return jsonify(new_category.serialize()), 200

    except Exception as e:
        return jsonify({"msg": f"El siguiente error acaba de ocurrir: {e}"}), 500


# Lista todas las categorias existentes
@api.route("/categories/", methods=["GET"])
@jwt_required()
def get_categories():
    try:
        user_id = get_jwt_identity()

        categories = Category.query.all()
        categories_list = [category.serialize() for category in categories]

        return jsonify({"categories": categories_list}), 200

    except Exception as e:
        return jsonify({"msg": f"El siguiente error acaba de ocurrir: {e}"}), 500


# Actualiza una categoria existente
@api.route("/categories/edit/<int:id>", methods=["PUT"])
@jwt_required()
def edit_category(id):
    try:
        is_admin = check_user_is_admin(get_jwt_identity())
        if is_admin:
            return is_admin

        name = request.json.get("name")
        descripttion = request.json.get("description")

        category = Category.query.filter_by(id=id).first()

        if not category:
            return jsonify({"msg": "No se encuentra la categoria"}), 404

        if name:
            category.name = name
        if descripttion:
            category.description = descripttion

        db.session.commit()

        return jsonify(category.serialize()), 200

    except Exception as e:
        return jsonify({"msg": f"El siguiente error acaba de ocurrir: {e}"}), 500


# Elimina una categoria existente
@api.route("/categories/delete/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_category(id):
    try:
        is_admin = check_user_is_admin(get_jwt_identity())
        if is_admin:
            return is_admin

        category = Category.query.filter_by(id=id).first()
        records = Record.query.filter_by(category_id=id).first()

        if not category:
            return jsonify({"msg": "No se encuentra la categoria"}), 404

        if records:
            return (
                jsonify(
                    {
                        "msg": "Esta categoria esta en uso por uno o mas registros, no se puede eliminar"
                    }
                ),
                404,
            )

        db.session.delete(category)
        db.session.commit()

        return jsonify({"msg": "Categoria eliminada exitosamente"}), 200

    except Exception as e:
        return jsonify({"msg": f"El siguiente error acaba de ocurrir: {e}"}), 500


# Nueva ruta 1 Jose
# Ruta para crear la nueva meta o Goal
@api.route("/goal/add", methods=["POST"])
@jwt_required()
def set_goal():
    try:
        user_id = get_jwt_identity()
        name_goal = request.json.get("name")
        goal_value = request.json.get("goal_value")
        is_complete = False

        user = User.query.filter_by(id = user_id).first()

        if not user_id or not name_goal or not goal_value:
            return jsonify({"msg": "Completar todos los campos solicitados"}), 404
        goal = Goal.query.filter_by(user_id=user_id, name=name_goal).first()

        if goal:
            return (jsonify({"msg": "El nombre de Goal ya existe"})), 404
        

        # Condicion pars verificar que el usuario no es premium y si tiene mas de 3 goals creadas, llego a si lmite de prueba
        all_goals = Goal.query.filter_by(user_id=user_id).all()
        if not user.is_premium and len(all_goals) >= 3:
            return jsonify({'msg': 'El usuario es Free y ya tiene mas de 3 metas creadas'}), 403
        

        new_goal = Goal(
            name=name_goal,
            goal_value=goal_value,
            is_complete=is_complete,
            user_id=user_id,
        )

        db.session.add(new_goal)
        db.session.commit()
        return jsonify(new_goal.serialize()), 201
    except Exception as e:
        return jsonify({"msg": f"El siguiente error acaba de ocurrir: {e}"}), 500


# Ruta para Modificar el Goal
@api.route("/goal/edit/<int:id>", methods=["PUT"])
@jwt_required()
def edit_goal(id):

    try:
        user_id = get_jwt_identity()
        name_goal = request.json.get("name")
        goal_value = request.json.get("goal_value")

        goal_from_user = Goal.query.filter_by(user_id=user_id, id=id).first()

        if not goal_from_user:
            return jsonify({"msg": "El goal no existe"}), 404

        if name_goal:
            goal_from_user.name = name_goal

        if goal_value:
            goal_from_user.goal_value = goal_value

        db.session.commit()

        return jsonify(goal_from_user.serialize()), 201

    except Exception as e:
        return jsonify({"msg": f"El siguiente error acaba de ocurrir: {e}"}), 500


# Ruta para eliminar el Goal
@api.route("/goal/delete/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_goal(id):
    try:
        user_id = get_jwt_identity()

        goal_from_user = Goal.query.filter_by(user_id=user_id, id=id).first()

        if not goal_from_user:
            return jsonify({"msg": "EL Goal no existe para ese usuario"}), 404

        db.session.delete(goal_from_user)
        db.session.commit()

        return (jsonify({"msg": "Goal eliminada con exito"})), 200
    except Exception as e:
        return jsonify({"msg": f"El siguiente error acaba de ocurrir: {e}"}), 500


# Ruta para obtener todos los goals de un usuario
@api.route("/goal/get-all", methods = ['GET'])
@jwt_required()
def get_all_goals_from_user():
    try:
        user_id = get_jwt_identity()
        goals_from_user = Goal.query.filter_by(user_id=user_id).all()

        if not goals_from_user:
            return jsonify({"msg": "El usuario no tiene goals"}), 404

        goals_from_user = list(map(lambda goal: goal.serialize(), goals_from_user))

        return jsonify(goals_from_user), 201

    except Exception as e:
        return jsonify({"msg": f"El siguiente error acaba de ocurrir: {e}"}), 500


# Ruta para obtener un goal de un usuario por ID
@api.route("/goal/get/<int:id>", methods = ['GET'])
@jwt_required()
def get_goal_by_id(id):
    try:
        user_id = get_jwt_identity()
        goal_from_user = Goal.query.filter_by(user_id=user_id, id=id).first()

        if not goal_from_user:
            return jsonify({"msg": "Este goal no existe del usuario"}), 404

        return jsonify(goal_from_user.serialize()), 201

    except Exception as e:
        return jsonify({"msg": f"El siguiente error acaba de ocurrir: {e}"}), 500

      
# Ruta para obtener todos los progresos de los goals de un usuario 
@api.route('/goal/get-progress', methods=['GET'])
@jwt_required()
def get_progress_from_goal():
    
    try:
        user_id = get_jwt_identity()
        goals_from_user = Goal.query.filter_by(user_id = user_id).all()
        wallets_by_user = Wallet.query.filter_by(user_id = user_id).all()
        sum_all_wallets_balance = 0
        list_of_progress_goals = []
        
        if wallets_by_user:
            for wallet in wallets_by_user:
                sum_all_wallets_balance += wallet.total_value
                
        if not goals_from_user:
            return jsonify({'msg':"No se tienen metas (goals) de este usuario"}), 404

        if sum_all_wallets_balance < 0:
            sum_all_wallets_balance = 0

        for goal in goals_from_user:

            remaining = goal.goal_value - sum_all_wallets_balance
            progress = (sum_all_wallets_balance * 100) // goal.goal_value
            list_of_progress_goals.append({
                "id":goal.id,
                "name":goal.name,
                "goal_value": goal.goal_value,
                "balance": sum_all_wallets_balance,
                "remaining":  remaining ,
                "progress":  progress  
            })


        return jsonify(list_of_progress_goals), 201

    except Exception as e:
        return jsonify({"msg": f"El siguiente error acaba de ocurrir: {e}"}), 500


# Ruta Editar Usuario
@api.route('/user/edit', methods=['PUT'])
@jwt_required()
def actualizar_usuario():
    data = request.get_json()
    if not data:
        return jsonify({"msg": "No se proporcionan datos"}), 400

    user_id = get_jwt_identity()
    user = User.query.filter_by(id=user_id).first()
    if not user:
        return jsonify({"msg": "User not found"}), 404

    campos_actualizables = ['name', 'email', 'password', 'phone', 'address']

    for campo in campos_actualizables:
        if campo in data:
            if campo == 'password':
                hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
                setattr(user, 'password', hashed_password)
            elif campo == 'phone' and data[campo] != "" and str(data[campo]) != user.phone:
                msg = f"Bienvenid@ a AhorrApp 😁, ahora puedes ingresar tus registros a traves de Whatsapp!"
                    
                setattr(user, 'phone', data[campo])
                
                twilio_client.messages.create(
                from_=TWILIO_NUMBER,
                to=f"whatsapp:{str(data[campo])}",
                body=msg
                )
            else:
                setattr(user, campo, data[campo] if data[campo] is not None else None)

    db.session.commit()
    return jsonify(user.serialize()), 200

# ruta get Obtener Datos de Usuario

@api.route('/user/get', methods=['GET'])
@jwt_required()
def get_user():
    user_id = get_jwt_identity()
    user = User.query.filter_by(id=user_id).first()

    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    return jsonify(user.serialize()), 200


# RUTAS PARA PAYPAL
# Crear orden -> se llama desde el boton PayPal -> flux.js
@api.route("/paypal/create-order", methods=["POST"])
def create_order():
    try:
        data = request.get_json()
        amount = data.get("amount")
        access_token = get_access_token() # Esta funcion la traigo desde el utils.py

        body = {
            "intent": "CAPTURE",
            "purchase_units": [
                {"amount": {"currency_code": "USD", "value": f"{amount:.2f}"}}
            ],
            "application_context": {
                "return_url": PAYPAL_RETURN_URL,
                "cancel_url": PAYPAL_BASE_URL,
            },
        }

        response = requests.post(
            f"{PAYPAL_BASE_URL}/v2/checkout/orders",
            json=body,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {access_token}",
            },
        )

        return jsonify(response.json()), response.status_code

    except Exception as e:
        return jsonify({"msg": f"El siguiente error acaba de ocurrir: {e}"}), 500


"""
Captura la orden luego que el usuario le dio pagar en la web de PayPal 
Se llama a esta ruta desde el useEffect que esta en la pagina PayPalSuccess.jsx
La cual llama a la funcion que esta en flux, y es esta la que llama a esta ruta
>- Si lo que devuelve paypal es COMPLETED, se modifica el campo is_premium del usuario que esta logueado -<
"""
@api.route("/paypal/capture-order", methods=["POST"])
@jwt_required()
def capture_order():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        order_id = data.get("order_id")
        access_token = get_access_token()

        response = requests.post(
            f"{PAYPAL_BASE_URL}/v2/checkout/orders/{order_id}/capture",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {access_token}",
            },
        )

        data = response.json()
        if data.get("status") == "COMPLETED" and user_id:
            user = User.query.filter_by(id=user_id).first()

        if not user:
            return (
                jsonify(
                    {
                        "msg": "No se pudo realizar el pago debido a inexistencia del usuario."
                    }
                ),
                404,
            )

        user.is_premium = True
        db.session.commit()

        return jsonify(response.json()), response.status_code

    except Exception as e:
        return jsonify({"msg": f"El siguiente error acaba de ocurrir: {e}"}), 500


# Listas a todos los usuarios regitrados en la plataforma, funcion solo para admin
@api.route("/admin/get-users", methods=["GET"])
@jwt_required()
def get_all_users():
    try:
        is_not_admin = check_user_is_admin(get_jwt_identity())

        if is_not_admin:
            return is_not_admin

        users = User.query.all()

        if not users:
            return jsonify({"msg": "No hay usuarios creados"}), 400

        users = list(map(lambda user: user.serialize(), users))

        return jsonify(users), 200

    except Exception as e:
        return jsonify({"msg": f"El siguiente error acaba de ocurrir: {e}"}), 500


# Ruta para borrar un usuario, solo siendo un admin
@api.route("/admin/user/delete/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_user(id):
    try:
        is_not_admin = check_user_is_admin(get_jwt_identity())
        admin_user_id = get_jwt_identity()

        if int(admin_user_id) == int(id):
            return jsonify({"msg": "No puedes eliminar tu propio usuario"}), 403

        if is_not_admin:
            return is_not_admin

        user = User.query.filter_by(id=id).first()

        if not user:
            return ({"msg": "El usuario no existe"}), 400

        db.session.delete(user)
        db.session.commit()

        return (jsonify({"msg": "Usuario eliminado con exito"})), 200

    except Exception as e:
        return jsonify({"msg": f"El siguiente error acaba de ocurrir: {e}"}), 500


#Ruta Juan

# Ruta Back-end Calculadora

@api.route("/calculate-savings", methods=["POST"])
@jwt_required()
def calculate_savings():
    data = request.get_json()

    try:
        ingresos = float(data.get('ingresos', 0))
        gastos_fijos = float(data.get('gastos_fijos', 0))
        gastos_variables = float(data.get('gastos_variables', 0))
        objetivo = float(data.get('objetivo_ahorro', 0)) 

        ahorro = ingresos - (gastos_fijos + gastos_variables)
        porcentaje_ahorro = (ahorro / ingresos * 100) if ingresos > 0 else 0

        return jsonify({
            "ahorro": round(ahorro, 2),
            "porcentaje_ahorro": round(porcentaje_ahorro, 2)
        }), 200

    except Exception as e:
        return jsonify({"message": "Error en el cálculo", "error": str(e)}), 400



# ruta para obtener el conteo total de usuarios
@api.route("/admin/users/count", methods=["GET"])
@jwt_required()
def get_users_count():
    try:
        is_not_admin = check_user_is_admin(get_jwt_identity())

        if is_not_admin:
            return is_not_admin

        total_users_count = User.query.count() 

        return jsonify({"total_users_count": total_users_count}), 200

    except Exception as e:
        return jsonify({"msg": f"Error al obtener el conteo de usuarios: {e}"}), 500






#Ruta Rafa

#Ruta Jose

#Ruta Fede
@api.route("/whatsapp/records/add", methods=["POST"])
def wpp_add_records():
    try:
        from_number = request.form.get('From').replace("whatsapp:", "")
        body = request.form.get('Body')

        if not from_number or not body:
            return jsonify({"msg": "Faltan datos"}), 400

        user = User.query.filter_by(phone=from_number).first()
        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 400

        wallet = user.wallets[0] if user.wallets else None
        if not wallet:
            return jsonify({"msg": "El usuario no tiene wallets"}), 400
        
        result = parse_record_input(body, categories)
        
        
        category = Category.query.filter_by(name=categorize_with_ai(body)).first()
        
        if not category:
            category = Category.query.filter_by(name="General").first()
            if not category:
                category = Category(name="General", description="Categoria por defecto")
                db.session.add(category)
                db.session.flush()
                
        wallet.total_value += result['amount']

        new_record = Record(
            description=result.get('description', 'Empty'),
            amount=result.get('amount', 1),
            type="whatsapp",
            category_id=category.id,
            wallet_id=wallet.id,
            user_id=user.id
        )
        db.session.add(new_record)
        db.session.commit()
        
        msg = f"✅ Hola {user.name}, tu registro fue agregado exitosamente:\n" \
          f"- Descripción: {new_record.description}\n" \
          f"- Monto: {new_record.amount}\n" \
          f"- Categoría: {category.name}"

        twilio_client.messages.create(
            from_=TWILIO_NUMBER,
            to=f"whatsapp:{from_number}",
            body=msg
            )

        return jsonify({"msg": "Registro agregado satisfactoriamente"}), 201

    except Exception as e:
        msg = f"✅ Hola, tu registro no pudo agregarse.\n" \
        f"- Por favor intenta nuevamente. \n" \
        f"- Detalles: {new_record.amount}, {new_record.description}\n"        

        twilio_client.messages.create(
            from_=TWILIO_NUMBER,
            to=f"whatsapp:{from_number}",
            body=msg)
        
        return jsonify({"msg": "No se pudo agregar el registro a traves de whatsapp"}), 500