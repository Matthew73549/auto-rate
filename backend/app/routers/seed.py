from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..database import get_db

router = APIRouter(tags=["seed"])

@router.get("/seed")
def seed_data(db: Session = Depends(get_db)):
    # 0) Очищаем prices
    db.execute(text("DELETE FROM prices"))

    # 1) Обновляем services
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

    # 2) Города
    cities = [
        {"name": "Москва", "region": "Москва"},
        {"name": "Санкт-Петербург", "region": "Санкт-Петербург"},
        {"name": "Казань", "region": "Республика Татарстан"},
        {"name": "Екатеринбург", "region": "Свердловская область"},
        {"name": "Новосибирск", "region": "Новосибирская область"},
    ]

    # 3) Услуги
    services = [
        {"name": "Замена масла в двигателе", "category": "engine", "description": "Замена моторного масла", "base_time_minutes": 60, "complexity_factor": 1.0},
        {"name": "Замена тормозных колодок", "category": "brakes", "description": "Замена передних тормозных колодок", "base_time_minutes": 90, "complexity_factor": 1.2},
        {"name": "Диагностика двигателя", "category": "engine", "description": "Компьютерная диагностика", "base_time_minutes": 45, "complexity_factor": 1.0},
        {"name": "Замена воздушного фильтра", "category": "engine", "description": "Замена фильтра двигателя", "base_time_minutes": 30, "complexity_factor": 1.0},
        {"name": "Замена свечей зажигания", "category": "engine", "description": "Замена свечей", "base_time_minutes": 60, "complexity_factor": 1.1},
        {"name": "Балансировка колёс", "category": "wheels", "description": "Балансировка одного колеса", "base_time_minutes": 40, "complexity_factor": 1.0},
        {"name": "Замена аккумулятора", "category": "electrical", "description": "Замена АКБ", "base_time_minutes": 20, "complexity_factor": 1.0},
    ]

    # Базовые цены для услуг
    base_prices = {
        "Замена масла в двигателе": 1200,
        "Замена тормозных колодок": 2500,
        "Диагностика двигателя": 1500,
        "Замена воздушного фильтра": 500,
        "Замена свечей зажигания": 1200,
        "Балансировка колёс": 800,
        "Замена аккумулятора": 600,
    }

    # Добавляем города → city_ids
    city_ids = {}
    for city in cities:
        db.execute(
            text("""
                INSERT INTO cities (name, region)
                SELECT :name, :region
                WHERE NOT EXISTS (SELECT 1 FROM cities WHERE name = :name)
            """),
            city
        )
        result = db.execute(text("SELECT id FROM cities WHERE name = :name"), city).fetchone()
        if result:
            city_ids[city["name"]] = result[0]

    # Добавляем услуги → service_ids
    service_ids = {}
    for service in services:
        db.execute(
            text("""
                INSERT INTO services (name, category, description, base_time_minutes, complexity_factor)
                SELECT :name, :category, :description, :base_time_minutes, :complexity_factor
                WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = :name)
            """),
            service
        )
        result = db.execute(text("SELECT id FROM services WHERE name = :name"), service).fetchone()
        if result:
            service_ids[service["name"]] = result[0]

    # 4) Цены: для каждой услуги — все города
    prices = []
    for service_name, avg in base_prices.items():
        for city_name in city_ids.keys():
            # Коэффициент города (Москва дороже, регионы дешевле)
            city_coef = {"Москва": 1.0, "Санкт-Петербург": 0.9, "Казань": 0.8, "Екатеринбург": 0.8, "Новосибирск": 0.8}.get(city_name, 0.8)
            prices.append({
                "service_name": service_name,
                "city_name": city_name,
                "price_min": int(avg * 0.8 * city_coef),
                "price_avg": int(avg * city_coef),
                "price_max": int(avg * 1.2 * city_coef),
            })

    # Вставляем цены
    for price in prices:
        s_id = service_ids.get(price["service_name"])
        c_id = city_ids.get(price["city_name"])
        if s_id is None or c_id is None:
            continue

        db.execute(
            text("""
                INSERT INTO prices (service_id, city_id, price_min, price_avg, price_max)
                VALUES (:service_id, :city_id, :price_min, :price_avg, :price_max)
            """),
            {
                "service_id": s_id,
                "city_id": c_id,
                "price_min": price["price_min"],
                "price_avg": price["price_avg"],
                "price_max": price["price_max"],
            }
        )

    db.commit()

    return {
        "status": "ok",
        "message": f"Добавлено {len(prices)} цен для всех услуг и городов.",
        "cities_count": len(cities),
        "services_count": len(services),
        "prices_count": len(prices),
    }