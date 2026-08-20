from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, DateTime, Boolean, Text, Float, ForeignKey
from datetime import datetime
from typing import Optional, List

db = SQLAlchemy()

# -------------------------------------------------------------
# 1. TABLA USER
# -------------------------------------------------------------
class User(db.Model):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    lastname: Mapped[str] = mapped_column(String(100), nullable=False)
    role: Mapped[Optional[str]] = mapped_column(String(50), default="user")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    email_verify: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relaciones
    events: Mapped[List["Event"]] = relationship(back_populates="organizer")
    favorite_events: Mapped[List["FavoriteEvent"]] = relationship(back_populates="user")

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "name": self.name,
            "lastname": self.lastname,
            "role": self.role,
            "is_active": self.is_active,
            "email_verify": self.email_verify,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


# -------------------------------------------------------------
# 2. TABLA CATEGORY
# -------------------------------------------------------------
class Category(db.Model):
    __tablename__ = 'categories'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    icon: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    # Relaciones
    events: Mapped[List["Event"]] = relationship(back_populates="category")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "icon": self.icon
        }


# -------------------------------------------------------------
# 3. TABLA EVENT
# -------------------------------------------------------------
class Event(db.Model):
    __tablename__ = 'events'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    location_name: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    address: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    latitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    longitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    start_time: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    end_time: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    image_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="active", nullable=False)
    
    # Claves Foráneas
    organizer_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relaciones
    organizer: Mapped["User"] = relationship(back_populates="events")
    category: Mapped["Category"] = relationship(back_populates="events")
    favorite_events: Mapped[List["FavoriteEvent"]] = relationship(back_populates="event")

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "location_name": self.location_name,
            "address": self.address,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "start_time": self.start_time.isoformat() if self.start_time else None,
            "end_time": self.end_time.isoformat() if self.end_time else None,
            "image_url": self.image_url,
            "status": self.status,
            "organizer_id": self.organizer_id,
            "category_id": self.category_id,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


# -------------------------------------------------------------
# 4. TABLA FAVORITE_EVENTS
# -------------------------------------------------------------
class FavoriteEvent(db.Model):
    __tablename__ = 'favorite_events'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    event_id: Mapped[int] = mapped_column(ForeignKey("events.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relaciones
    user: Mapped["User"] = relationship(back_populates="favorite_events")
    event: Mapped["Event"] = relationship(back_populates="favorite_events")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "event_id": self.event_id,
            "event": self.event.serialize() if self.event else None,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
# -------------------------------------------------------------
# 5. COORDENADAS
# -------------------------------------------------------------

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Place(db.Model):
    __tablename__ = 'place'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    address = db.Column(db.String(255), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50), nullable=False) # ej: 'Restaurante', 'Concierto'
    image_url = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relación con el usuario que lo creó
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "address": self.address,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "category": self.category,
            "image_url": self.image_url,
            "user_id": self.user_id
        }

    from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Place

api = Blueprint('api', __name__)

# GET: Listar todos los lugares
@api.route('/places', methods=['GET'])
def get_places():
    places = Place.query.all()
    return jsonify([place.serialize() for place in places]), 200

# POST: Crear un nuevo lugar (Protegido)
@api.route('/places', methods=['POST'])
@jwt_required()
def add_place():
    body = request.get_json()
    current_user_id = get_jwt_identity()

    # Validación básica
    required_fields = ["name", "latitude", "longitude", "category"]
    if not all(field in body for field in required_fields):
        return jsonify({"msg": "Faltan campos obligatorios"}), 400

    new_place = Place(
        name=body['name'],
        description=body.get('description'),
        address=body.get('address', ''),
        latitude=body['latitude'],
        longitude=body['longitude'],
        category=body['category'],
        image_url=body.get('image_url'),
        user_id=current_user_id
    )

    db.session.add(new_place)
    db.session.commit()
    return jsonify({"msg": "Lugar creado con éxito", "place": new_place.serialize()}), 201