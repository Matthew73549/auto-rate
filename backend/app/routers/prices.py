from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/prices", tags=["prices"])

@router.get("", response_model=List[schemas.PriceResponse])
def list_prices(
    service_id: Optional[int] = Query(None),
    city_name: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(models.Price, models.City.name.label("city_name"), models.Service.name.label("service_name")).join(
        models.City, models.Price.city_id == models.City.id
    ).join(
        models.Service, models.Price.service_id == models.Service.id
    )

    if service_id:
        query = query.filter(models.Price.service_id == service_id)
    if city_name:
        query = query.filter(models.City.name == city_name)

    rows = query.all()
    result = []
    for price, city_name, service_name in rows:
        result.append(schemas.PriceResponse(
            id=price.id,
            service_id=price.service_id,
            city_id=price.city_id,
            price_min=price.price_min,
            price_avg=price.price_avg,
            price_max=price.price_max,
            source=price.source,
            updated_at=price.updated_at,
            city_name=city_name,
            service_name=service_name,
        ))
    return result