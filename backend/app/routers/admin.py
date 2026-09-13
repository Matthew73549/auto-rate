from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from .. import models
from ..database import get_db
from .. import auth as auth_module

router = APIRouter(prefix="/admin", tags=["admin"])


def get_current_admin_user(
    current_user: models.User = Depends(auth_module.get_current_user),
):
    if not current_user:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


# --- Services ---


class ServiceCreate(BaseModel):
    name: str
    category: str
    description: Optional[str] = None
    base_time_minutes: int = 60
    complexity_factor: float = 1.0


@router.get("/services", response_model=None)
def admin_list_services(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user),
):
    services = db.query(models.Service).all()
    return [
        {
            "id": s.id,
            "name": s.name,
            "category": s.category,
            "description": s.description,
            "base_time_minutes": s.base_time_minutes,
            "complexity_factor": s.complexity_factor,
        }
        for s in services
    ]


@router.post("/services", response_model=None)
def admin_create_service(
    data: ServiceCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user),
):
    service = models.Service(**data.model_dump())
    db.add(service)
    db.commit()
    db.refresh(service)
    return {
        "id": service.id,
        "name": service.name,
        "category": service.category,
        "description": service.description,
        "base_time_minutes": service.base_time_minutes,
        "complexity_factor": service.complexity_factor,
    }


@router.delete("/services/{service_id}", response_model=None)
def admin_delete_service(
    service_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user),
):
    service = db.query(models.Service).filter(models.Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    db.delete(service)
    db.commit()
    return {"deleted": True}


# --- Prices ---


class PriceCreate(BaseModel):
    service_id: int
    city_id: int
    price_min: float
    price_avg: float
    price_max: float
    source: str = "manual"


@router.get("/prices", response_model=None)
def admin_list_prices(
    service_id: Optional[int] = None,
    city_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user),
):
    query = db.query(models.Price)
    if service_id:
        query = query.filter(models.Price.service_id == service_id)
    if city_id:
        query = query.filter(models.Price.city_id == city_id)
    prices = query.all()
    return [
        {
            "id": p.id,
            "service_id": p.service_id,
            "city_id": p.city_id,
            "price_min": p.price_min,
            "price_avg": p.price_avg,
            "price_max": p.price_max,
            "source": p.source,
            "updated_at": p.updated_at.isoformat() if p.updated_at else None,
        }
        for p in prices
    ]


@router.post("/prices", response_model=None)
def admin_create_price(
    data: PriceCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user),
):
    price = models.Price(**data.model_dump())
    db.add(price)
    db.commit()
    db.refresh(price)
    return {
        "id": price.id,
        "service_id": price.service_id,
        "city_id": price.city_id,
        "price_min": price.price_min,
        "price_avg": price.price_avg,
        "price_max": price.price_max,
        "source": price.source,
    }


@router.delete("/prices/{price_id}", response_model=None)
def admin_delete_price(
    price_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user),
):
    price = db.query(models.Price).filter(models.Price.id == price_id).first()
    if not price:
        raise HTTPException(status_code=404, detail="Price not found")
    db.delete(price)
    db.commit()
    return {"deleted": True}


# --- Cars ---


class CarCreate(BaseModel):
    brand: str
    model: str
    generation: Optional[str] = None
    year_from: Optional[int] = None
    year_to: Optional[int] = None


@router.get("/cars", response_model=None)
def admin_list_cars(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user),
):
    cars = db.query(models.Car).all()
    return [
        {
            "id": c.id,
            "brand": c.brand,
            "model": c.model,
            "generation": c.generation,
            "year_from": c.year_from,
            "year_to": c.year_to,
        }
        for c in cars
    ]


@router.post("/cars", response_model=None)
def admin_create_car(
    data: CarCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user),
):
    car = models.Car(**data.model_dump())
    db.add(car)
    db.commit()
    db.refresh(car)
    return {
        "id": car.id,
        "brand": car.brand,
        "model": car.model,
        "generation": car.generation,
        "year_from": car.year_from,
        "year_to": car.year_to,
    }


@router.delete("/cars/{car_id}", response_model=None)
def admin_delete_car(
    car_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user),
):
    car = db.query(models.Car).filter(models.Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    db.delete(car)
    db.commit()
    return {"deleted": True}


# --- Cities ---


class CityCreate(BaseModel):
    name: str
    region: Optional[str] = None


@router.get("/cities", response_model=None)
def admin_list_cities(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user),
):
    cities = db.query(models.City).all()
    return [{"id": c.id, "name": c.name, "region": c.region} for c in cities]


@router.post("/cities", response_model=None)
def admin_create_city(
    data: CityCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user),
):
    city = models.City(**data.model_dump())
    db.add(city)
    db.commit()
    db.refresh(city)
    return {"id": city.id, "name": city.name, "region": city.region}


@router.delete("/cities/{city_id}", response_model=None)
def admin_delete_city(
    city_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user),
):
    city = db.query(models.City).filter(models.City.id == city_id).first()
    if not city:
        raise HTTPException(status_code=404, detail="City not found")
    db.delete(city)
    db.commit()
    return {"deleted": True}