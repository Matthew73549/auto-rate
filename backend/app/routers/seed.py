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

    # 4) Тестовые цены (для всех городов и нескольких услуг)
    prices = [
        # service_id=1 (Замена масла) для всех городов
        {"service_name": "Замена масла в двигателе", "city_name": "Москва", "price_min": 800, "price_avg": 1200, "price_max": 1600},
        {"service_name": "Замена масла в двигателе", "city_name": "Санкт-Петербург", "price_min": 700, "price_avg": 1000, "price_max": 1400},
        {"service_name": "Замена масла в двигателе", "city_name": "Казань", "price_min": 600, "price_avg": 900, "price_max": 1200},
        {"service_name": "Замена масла в двигателе", "city_name": "Екатеринбург", "price_min": 600, "price_avg": 900, "price_max": 1200},
        {"service_name": "Замена масла в двигателе", "city_name": "Новосибирск", "price_min": 600, "price_avg": 900, "price_max": 1200},
        
        # service_id=2 (Замена колодок) для Москвы и СПб
        {"service_name": "Замена тормозных колодок", "city_name": "Москва", "price_min": 1500, "price_avg": 2500, "price_max": 3500},
        {"service_name": "Замена тормозных колодок", "city_name": "Санкт-Петербург", "price_min": 1400, "price_avg": 2200, "price_max": 3000},
        
        # service_id=3 (Диагностика) для Москвы
        {"service_name": "Диагностика двигателя", "city_name": "Москва", "price_min": 1000, "price_avg": 1500, "price_max": 2000},
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

    # Добавляем цены
    for price in prices:
        db.execute(
            text("""
                INSERT INTO prices (service_id, city_id, price_min, price_avg, price_max)
                SELECT s.id, c.id, :price_min, :price_avg, :price_max
                FROM services s, cities c
                WHERE s.name = :service_name
                  AND c.name = :city_name
                  AND NOT EXISTS (
                    SELECT 1 FROM prices p
                    WHERE p.service_id = s.id AND p.city_id = c.id
                  )
            """),
            price
        )

    db.commit()

    return {
        "status": "ok",
        "message": "Добавлены/обновлены тестовые города, услуги и цены.",
        "cities_count": len(cities),
        "services_count": len(services),
        "prices_count": len(prices),
    }