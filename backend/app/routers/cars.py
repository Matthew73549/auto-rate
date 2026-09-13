from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/cars", tags=["cars"])

@router.get("", response_model=List[schemas.CarResponse])
def list_cars(
    brand: Optional[str] = Query(None),
    model: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(models.Car)
    if brand:
        query = query.filter(models.Car.brand.ilike(f"%{brand}%"))
    if model:
        query = query.filter(models.Car.model.ilike(f"%{model}%"))
    cars = query.all()
    return cars

@router.get("/{car_id}/services", response_model=List[schemas.CarServiceStatResponse])
def get_car_services(
    car_id: int,
    db: Session = Depends(get_db),
):
    stats = db.query(models.CarServiceStats, models.Service.name.label("service_name")).join(
        models.Service, models.CarServiceStats.service_id == models.Service.id
    ).filter(models.CarServiceStats.car_id == car_id).all()

    result = []
    for stat, service_name in stats:
        result.append(schemas.CarServiceStatResponse(
            service_id=stat.service_id,
            service_name=service_name,
            frequency_score=stat.frequency_score,
            notes=stat.notes,
        ))
    return result