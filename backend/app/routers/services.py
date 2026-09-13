from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/services", tags=["services"])

@router.get("", response_model=List[schemas.ServiceResponse])
def list_services(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(models.Service)
    if category:
        query = query.filter(models.Service.category == category)
    if search:
        query = query.filter(models.Service.name.ilike(f"%{search}%"))
    services = query.all()
    return services

@router.get("/cities", response_model=List[schemas.CityResponse])
def list_cities(db: Session = Depends(get_db)):
    cities = db.query(models.City).order_by(models.City.id).all()
    return cities