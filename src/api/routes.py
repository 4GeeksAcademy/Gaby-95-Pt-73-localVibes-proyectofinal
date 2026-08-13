from flask import Flask, request, jsonify, Blueprint
from api.models import db, User, Category, Event, FavoriteEvent
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from sqlalchemy import select, or_, delete
from datetime import datetime

api = Blueprint('api', __name__)
CORS(api)

# =============================================================
# 1. AUTENTICACIÓN Y USUARIOS (Signup, Login, Profile)
# =============================================================

@api.route('/signup', methods=['POST'])
def signup():
    body = request.get_json()
    required_fields = ["email", "password", "username", "name", "lastname"]
    if not body or any(field not in body or not body[field] for field in required_fields):
        return jsonify({"message": f"Faltan datos obligatorios: {', '.join(required_fields)}"}), 400

    stmt = select(User).where(or_(User.email == body["email"], User.username == body["username"]))
    if db.session.scalar(stmt):
        return jsonify({"message": "El username o el email ya se encuentran registrados"}), 400

    hashed_password = generate_password_hash(body["password"])
    new_user = User(
        username=body["username"],
        email=body["email"],
        password_hash=hashed_password,
        name=body["name"],
        lastname=body["lastname"],
        role=body.get("role", "user"),
        is_active=True,
        email_verify=False
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Usuario registrado exitosamente", "user": new_user.serialize()}), 201


@api.route('/login', methods=['POST'])
def login():
    body = request.get_json()
    if not body or not body.get("email") or not body.get("password"):
        return jsonify({"message": "Se requiere email y contraseña"}), 400

    stmt = select(User).where(User.email == body["email"])
    user = db.session.scalar(stmt)

    if not user or not check_password_hash(user.password_hash, body["password"]):
        return jsonify({"message": "Credenciales inválidas"}), 401

    if not user.is_active:
        return jsonify({"message": "La cuenta se encuentra inactiva"}), 403

    access_token = create_access_token(identity=str(user.id))
    return jsonify({"message": "Inicio de sesión exitoso", "token": access_token, "user": user.serialize()}), 200


@api.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_id = get_jwt_identity()
    user = db.session.get(User, int(current_user_id))

    if not user:
        return jsonify({"message": "Usuario no encontrado"}), 404

    return jsonify(user.serialize()), 200


# =============================================================
# 2. CATEGORÍAS (Para los Filtros en Home y Búsqueda)
# =============================================================

@api.route('/categories', methods=['GET'])
def get_categories():
    stmt = select(Category)
    categories = db.session.scalars(stmt).all()
    return jsonify([category.serialize() for category in categories]), 200


@api.route('/categories', methods=['POST'])
def create_category():
    body = request.get_json()
    if not body or not body.get("name"):
        return jsonify({"message": "El nombre de la categoría es obligatorio"}), 400

    new_category = Category(
        name=body["name"],
        description=body.get("description"),
        icon=body.get("icon")
    )
    db.session.add(new_category)
    db.session.commit()
    return jsonify(new_category.serialize()), 201


# =============================================================
# 3. EVENTOS (Home, Events, Mapa y EventCard / Detalle)
# =============================================================

# Obtener todos los eventos (Permite filtrar por categoría query param: /api/events?category_id=1)
@api.route('/events', methods=['GET'])
def get_events():
    category_id = request.args.get('category_id')
    stmt = select(Event).where(Event.status == "active")

    if category_id:
        stmt = stmt.where(Event.category_id == int(category_id))

    events = db.session.scalars(stmt).all()
    return jsonify([event.serialize() for event in events]), 200


# Obtener detalle de un evento específico (Página Eventcard / Details)
@api.route('/events/<int:event_id>', methods=['GET'])
def get_event_detail(event_id):
    event = db.session.get(Event, event_id)
    if not event:
        return jsonify({"message": "Evento no encontrado"}), 404

    return jsonify(event.serialize()), 200


# Crear un nuevo evento (Página Create Event - Requiere Token JWT)
@api.route('/events', methods=['POST'])
@jwt_required()
def create_event():
    current_user_id = int(get_jwt_identity())
    body = request.get_json()

    required_fields = ["title", "category_id"]
    if not body or any(field not in body or not body[field] for field in required_fields):
        return jsonify({"message": "Faltan campos obligatorios para el evento"}), 400

    # Convertir fechas si vienen en formato ISO string
    start_time = datetime.fromisoformat(body["start_time"]) if body.get("start_time") else None
    end_time = datetime.fromisoformat(body["end_time"]) if body.get("end_time") else None

    new_event = Event(
        title=body["title"],
        description=body.get("description"),
        location_name=body.get("location_name"),
        address=body.get("address"),
        latitude=body.get("latitude"),
        longitude=body.get("longitude"),
        start_time=start_time,
        end_time=end_time,
        image_url=body.get("image_url"),
        status="active",
        organizer_id=current_user_id,
        category_id=int(body["category_id"])
    )

    db.session.add(new_event)
    db.session.commit()
    return jsonify({"message": "Evento creado exitosamente", "event": new_event.serialize()}), 201


# Obtener eventos creados por el usuario logueado (Mis Eventos Creados)
@api.route('/user/events', methods=['GET'])
@jwt_required()
def get_user_events():
    current_user_id = int(get_jwt_identity())
    stmt = select(Event).where(Event.organizer_id == current_user_id)
    events = db.session.scalars(stmt).all()
    return jsonify([event.serialize() for event in events]), 200


# =============================================================
# 4. FAVORITOS / EVENTOS GUARDADOS (Página Favorites)
# =============================================================

# Obtener la lista de eventos favoritos del usuario autenticado
@api.route('/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    current_user_id = int(get_jwt_identity())
    stmt = select(FavoriteEvent).where(FavoriteEvent.user_id == current_user_id)
    favorites = db.session.scalars(stmt).all()
    return jsonify([fav.serialize() for fav in favorites]), 200


# Agregar un evento a favoritos
@api.route('/favorites/<int:event_id>', methods=['POST'])
@jwt_required()
def add_favorite(event_id):
    current_user_id = int(get_jwt_identity())

    # Verificar si ya existe en favoritos
    stmt = select(FavoriteEvent).where(
        FavoriteEvent.user_id == current_user_id,
        FavoriteEvent.event_id == event_id
    )
    existing_favorite = db.session.scalar(stmt)

    if existing_favorite:
        return jsonify({"message": "El evento ya está en tus favoritos"}), 400

    new_favorite = FavoriteEvent(user_id=current_user_id, event_id=event_id)
    db.session.add(new_favorite)
    db.session.commit()

    return jsonify({"message": "Evento agregado a favoritos", "favorite": new_favorite.serialize()}), 201


# Eliminar un evento de favoritos
@api.route('/favorites/<int:event_id>', methods=['DELETE'])
@jwt_required()
def remove_favorite(event_id):
    current_user_id = int(get_jwt_identity())

    stmt = select(FavoriteEvent).where(
        FavoriteEvent.user_id == current_user_id,
        FavoriteEvent.event_id == event_id
    )
    favorite = db.session.scalar(stmt)

    if not favorite:
        return jsonify({"message": "Favorito no encontrado"}), 404

    db.session.delete(favorite)
    db.session.commit()

    return jsonify({"message": "Evento eliminado de favoritos"}), 200