from sqlalchemy import create_engine, text

DATABASE_URL = "postgresql://auto_rate_db_user:IZetKlLWiQNI9TEDCx2lYvz6YhH81Rnh@dpg-daj5dqmq1p3s73a6m6e0-a/auto_rate_db"

engine = create_engine(DATABASE_URL)

# Тестовые города
cities = [
    ("Москва", "Москва"),
    ("Санкт-Петербург", "Санкт-Петербург"),
    ("Казань", "Республика Татарстан"),
    ("Екатеринбург", "Свердловская область"),
    ("Новосибирск", "Новосибирская область"),
]

# Тестовые услуги
services = [
    ("Замена масла в двигателе", "engine"),
    ("Замена тормозных колодок", "brakes"),
    ("Диагностика двигателя", "engine"),
    ("Замена воздушного фильтра", "engine"),
    ("Замена свечей зажигания", "engine"),
    ("Балансировка колёс", "wheels"),
    ("Замена аккумулятора", "electrical"),
]

with engine.connect() as conn:
    # Добавляем города
    for name, region in cities:
        conn.execute(
            text("""
                INSERT INTO cities (name, region)
                SELECT :name, :region
                WHERE NOT EXISTS (
                    SELECT 1 FROM cities WHERE name = :name
                )
            """),
            {"name": name, "region": region}
        )
    
    # Добавляем услуги
    for name, category in services:
        conn.execute(
            text("""
                INSERT INTO services (name, category)
                SELECT :name, :category
                WHERE NOT EXISTS (
                    SELECT 1 FROM services WHERE name = :name
                )
            """),
            {"name": name, "category": category}
        )
    
    conn.commit()

print("Готово! Добавлены тестовые города и услуги.")