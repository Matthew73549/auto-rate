from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..database import get_db

router = APIRouter(tags=["seed"])

@router.get("/seed")
def seed_data(db: Session = Depends(get_db)):
    # Тестовые города
    cities = [
        {"name": "Москва", "region": "Москва"},
        {"name": "Санкт-Петербург", "region": "Санкт-Петербург"},
        {"name": "Казань", "region": "Республика Татарстан"},
        {"name": "Екатеринбург", "region": "Свердловская область"},
        {"name": "Новосибирск", "region": "Новосибирская область"},
    ]

    # Тестовые услуги
    services = [
        {"name": "Замена масла в двигателе", "category": "engine"},
        {"name": "Замена тормозных колодок", "category": "brakes"},
        {"name": "Диагностика двигателя", "category": "engine"},
        {"name": "Замена воздушного фильтра", "category": "engine"},
        {"name": "Замена свечей зажигания", "category": "engine"},
        {"name": "Балансировка колёс", "category": "wheels"},
        {"name": "Замена аккумулятора", "category": "electrical"},
    ]

    # Добавляем города
    for city in cities:
        db.execute(
            text("""
                INSERT INTO cities (name, region)
                SELECT :name, :region
                WHERE NOT EXISTS (
                    SELECT 1 FROM cities WHERE name = :name
                )
            """),
            city
        )

    # Добавляем услуги
    for service in services:
        db.execute(
            text("""
                INSERT INTO services (name, category)
                SELECT :name, :category
                WHERE NOT EXISTS (
                    SELECT 1 FROM services WHERE name = :name
                )
            """),
            service
        )

    db.commit()

    return {
        "status": "ok",
        "message": "Добавлены тестовые города и услуги.",
        "cities_count": len(cities),
        "services_count": len(services),
    }