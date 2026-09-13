from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Optional
import httpx
from sqlalchemy.orm import Session

from ..models import Car
from ..database import get_db

router = APIRouter(prefix="/vin", tags=["vin"])

NHTSA_DECODE_URL = "https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin"


class VinDecodeInput(BaseModel):
    vin: str = Field(..., min_length=17, max_length=17)


class VinDecodeResult(BaseModel):
    vin: str
    brand: Optional[str]
    model: Optional[str]
    year: Optional[int]
    generation: Optional[str]
    plant: Optional[str]
    body_class: Optional[str]
    engine: Optional[str]
    matched_car_id: Optional[int] = None
    matched_car: Optional[dict] = None


def decode_vin_nhtsa(vin: str) -> dict:
    url = f"{NHTSA_DECODE_URL}/{vin}?format=json"
    try:
        resp = httpx.get(url, timeout=10.0)
        resp.raise_for_status()
        data = resp.json()
    except Exception:
        raise HTTPException(status_code=500, detail="VIN decode service error")

    results = data.get("Results", [])
    kv = {}
    for r in results:
        var = r.get("Variable", "")
        val = r.get("Value", "")
        if var and val:
            kv[var] = val

    brand = kv.get("Make")
    model = kv.get("Model")
    year_raw = kv.get("Model Year")
    year = int(year_raw) if year_raw and year_raw.isdigit() else None
    plant = kv.get("Plant City") or kv.get("Plant Country")
    body_class = kv.get("Body Class")
    engine = kv.get("Engine Configuration") or kv.get("Displacement (L)")
    generation = None

    return {
        "brand": brand,
        "model": model,
        "year": year,
        "generation": generation,
        "plant": plant,
        "body_class": body_class,
        "engine": engine,
        "raw": kv,
    }


def normalize_brand_model(brand: Optional[str], model: Optional[str]) -> tuple:
    if not brand:
        return None, None
    brand_norm = brand.strip().title()
    mapping = {
        "Lada": "Lada",
        "VaZ": "Lada",
        "Vaz": "Lada",
        "Toyota": "Toyota",
        "Kia": "Kia",
        "Hyundai": "Hyundai",
        "Volkswagen": "Volkswagen",
        "VW": "Volkswagen",
        "Skoda": "Skoda",
        "Renault": "Renault",
        "Nissan": "Nissan",
        "Ford": "Ford",
        "Chevrolet": "Chevrolet",
        "Bmw": "BMW",
        "Mercedes-Benz": "Mercedes-Benz",
        "Mazda": "Mazda",
        "Honda": "Honda",
    }
    brand_norm = mapping.get(brand_norm, brand_norm)
    model_norm = model.strip().title() if model else None
    return brand_norm, model_norm


@router.post("/decode", response_model=VinDecodeResult)
def decode_vin(
    data: VinDecodeInput,
    db: Session = Depends(get_db),
):
    vin = data.vin.upper().replace(" ", "").replace("-", "")
    if len(vin) != 17:
        raise HTTPException(status_code=400, detail="VIN must be 17 characters")

    decoded = decode_vin_nhtsa(vin)
    brand_raw = decoded["brand"]
    model_raw = decoded["model"]
    year = decoded["year"]

    brand, model = normalize_brand_model(brand_raw, model_raw)

    matched_car = None
    matched_car_id = None

    if brand and model:
        query = db.query(Car).filter(
            Car.brand.ilike(f"%{brand}%"),
            Car.model.ilike(f"%{model}%"),
        )
        if year:
            query = query.filter(
                (Car.year_from.is_(None)) | (Car.year_from <= year),
                (Car.year_to.is_(None)) | (Car.year_to >= year),
            )
        cars = query.limit(5).all()
        if cars:
            c = cars[0]
            matched_car_id = c.id
            matched_car = {
                "id": c.id,
                "brand": c.brand,
                "model": c.model,
                "generation": c.generation,
                "year_from": c.year_from,
                "year_to": c.year_to,
            }

    return VinDecodeResult(
        vin=vin,
        brand=brand,
        model=model,
        year=year,
        generation=decoded["generation"],
        plant=decoded["plant"],
        body_class=decoded["body_class"],
        engine=decoded["engine"],
        matched_car_id=matched_car_id,
        matched_car=matched_car,
    )