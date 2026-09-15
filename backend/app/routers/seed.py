from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..database import get_db

router = APIRouter(tags=["seed"])

@router.get("/seed")
def seed_data(db: Session = Depends(get_db)):
    # 1) Обновляем старые записи services: проставляем дефолты там, где NULL
    db.execute(
        text("""
            UPDATE services
            SET
                base_time_minutes = COALESCE(base_time_minutes, 60),
                complexity_factor = COALESCE(complexity_factor, 1.0)
            WHERE
                base_time_minutes IS NULL
                OR complexity_factor IS NULL
        """)
    )

    # 2) Тестовые города
    cities = [
        {"name": "Москва", "region": "Москва"},
        {"name": "Санкт-Петербург", "region": "Санкт-Петербург"},
        {"name": "Казань", "region": "Республика Татарстан"},
        {"name": "Екатеринбург", "region": "Свердловская область"},
        {"name": "Новосибирск", "region": "Новосибирская область"},
    ]

    # 3) Тестовые услуги
    services = [
        {
            "name": "Замена масла в двигателе",
            "category": "engine",
            "description": "Замена моторного масла",
            "base_time_minutes": 60,
            "complexity_factor": 1.0,
        },
        {
            "name": "Замена тормозных колодок",
            "category": "brakes",
            "description": "Замена передних тормозных колодок",
            "base_time_minutes": 90,
            "complexity_factor": 1.2,
        },
        {
            "name": "Диагностика двигателя",
            "category": "engine",
            "description": "Компьютерная диагностика",
            "base_time_minutes": 45,
            "complexity_factor": 1.0,
        },
        {
            "name": "Замена воздушного фильтра",
            "category": "engine",
            "description": "Замена фильтра двигателя",
            "base_time_minutes": 30,
            "complexity_factor": 1.0,
        },
        {
            "name": "Замена свечей зажигания",
            "category": "engine",
            "description": "Замена свечей",
            "base_time_minutes": 60,
            "complexity_factor": 1.1,
        },
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
                INSERT INTO services (name, category, description, base_time_minutes, complexity_factor)
                SELECT :name, :category, :description, :base_time_minutes, :complexity_factor
                WHERE NOT EXISTS (
                    SELECT 1 FROM services WHERE name = :name
                )
            """),
            service
        )

    db.commit()

    return {
        "status": "ok",
        "message": "Добавлены/обновлены тестовые города и услуги.",
        "cities_count": len(cities),
        "services_count": len(services),
    }