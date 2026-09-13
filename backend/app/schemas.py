from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    city: str
    role: str = "mechanic"
    inn: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class UserResponse(BaseModel):
    id: int
    email: str
    city: str
    role: str
    subscription_status: str
    subscription_end: Optional[datetime]

class CityResponse(BaseModel):
    id: int
    name: str
    region: Optional[str]

class ServiceResponse(BaseModel):
    id: int
    name: str
    category: str
    description: Optional[str]
    base_time_minutes: int
    complexity_factor: float

class PriceResponse(BaseModel):
    id: int
    service_id: int
    city_id: int
    price_min: float
    price_avg: float
    price_max: float
    source: str
    updated_at: datetime
    city_name: str
    service_name: str

class CalculatorInput(BaseModel):
    service_id: int
    city_id: Optional[int] = None
    age_years: int
    mileage_km: int
    bolts_rusted: bool
    access_level: str
    special_tool_needed: bool
    urgency: str

class CalculatorResult(BaseModel):
    base_price_avg: float
    coefficients: dict
    final_price: float
    currency: str = "RUB"

class CarResponse(BaseModel):
    id: int
    brand: str
    model: str
    generation: Optional[str]
    year_from: Optional[int]
    year_to: Optional[int]

class CarServiceStatResponse(BaseModel):
    service_id: int
    service_name: str
    frequency_score: int
    notes: Optional[str]
