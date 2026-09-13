from app.database import SessionLocal, engine, Base
from app import models, schemas

# Создаём таблицы, если их нет
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Пример: service_id=1 — "Замена тормозных колодок"
# (service_id, city_id, price_min, price_avg, price_max)
test_prices = [
    (1, 1, 2000, 2500, 3000),
    (1, 2, 1800, 2300, 2800),
    (2, 1, 1200, 1500, 1800),
    (2, 2, 1100, 1400, 1700),
    (3, 1, 4000, 5000, 6000),
    (3, 2, 3800, 4800, 5800),
]

for service_id, city_id, price_min, price_avg, price_max in test_prices:
    db.add(models.Price(
        service_id=service_id,
        city_id=city_id,
        price_min=price_min,
        price_avg=price_avg,
        price_max=price_max,
        source="manual",
    ))

db.commit()
print(f"Добавлено {len(test_prices)} записей Price")

db.close()