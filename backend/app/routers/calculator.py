from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/calculator", tags=["calculator"])

def get_coefficients(data: schemas.CalculatorInput) -> dict:
    age = data.age_years
    if age <= 5:
        k_age = 1.0
    elif age <= 10:
        k_age = 1.1
    else:
        k_age = 1.2

    mileage = data.mileage_km
    if mileage <= 100_000:
        k_mileage = 1.0
    elif mileage <= 200_000:
        k_mileage = 1.1
    else:
        k_mileage = 1.2

    k_bolts = 1.3 if data.bolts_rusted else 1.0

    access_map = {"easy": 1.0, "medium": 1.2, "hard": 1.4}
    k_access = access_map.get(data.access_level, 1.0)

    k_tool = 1.15 if data.special_tool_needed else 1.0
    k_urgency = 1.2 if data.urgency == "urgent" else 1.0

    return {
        "age": k_age,
        "mileage": k_mileage,
        "bolts": k_bolts,
        "access": k_access,
        "tool": k_tool,
        "urgency": k_urgency,
    }

@router.post("", response_model=schemas.CalculatorResult)
def calculate_price(
    data: schemas.CalculatorInput,
    db: Session = Depends(get_db),
):
    if data.city_id:
        price_obj = db.query(models.Price).filter(
            models.Price.service_id == data.service_id,
            models.Price.city_id == data.city_id,
        ).first()
        if not price_obj:
            raise HTTPException(status_code=404, detail="Price not found for this service and city")
        base_price = price_obj.price_avg
    else:
        prices = db.query(models.Price).filter(models.Price.service_id == data.service_id).all()
        if not prices:
            raise HTTPException(status_code=404, detail="No prices found for this service")
        base_price = sum(p.price_avg for p in prices) / len(prices)

    coeffs = get_coefficients(data)
    k_total = 1.0
    for k in coeffs.values():
        k_total *= k

    final_price = base_price * k_total

    return schemas.CalculatorResult(
        base_price_avg=base_price,
        coefficients=coeffs,
        final_price=round(final_price, 2),
    )