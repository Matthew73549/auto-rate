from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="mechanic")
    inn = Column(String, nullable=True)
    city = Column(String, nullable=False)
    trial_start = Column(DateTime, server_default=func.now())
    subscription_status = Column(String, default="trial")
    subscription_end = Column(DateTime, nullable=True)

class City(Base):
    __tablename__ = "cities"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    region = Column(String, nullable=True)

class Service(Base):
    __tablename__ = "services"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    base_time_minutes = Column(Integer, default=60)
    complexity_factor = Column(Float, default=1.0)

class Price(Base):
    __tablename__ = "prices"
    id = Column(Integer, primary_key=True, index=True)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=False)
    city_id = Column(Integer, ForeignKey("cities.id"), nullable=False)
    price_min = Column(Float, nullable=False)
    price_avg = Column(Float, nullable=False)
    price_max = Column(Float, nullable=False)
    source = Column(String, default="manual")
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    service = relationship("Service")
    city = relationship("City")

class Car(Base):
    __tablename__ = "cars"
    id = Column(Integer, primary_key=True, index=True)
    brand = Column(String, nullable=False)
    model = Column(String, nullable=False)
    generation = Column(String, nullable=True)
    year_from = Column(Integer, nullable=True)
    year_to = Column(Integer, nullable=True)

class CarServiceStats(Base):
    __tablename__ = "car_service_stats"
    id = Column(Integer, primary_key=True, index=True)
    car_id = Column(Integer, ForeignKey("cars.id"), nullable=False)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=False)
    frequency_score = Column(Integer, default=5)
    notes = Column(Text, nullable=True)
    car = relationship("Car")
    service = relationship("Service")
