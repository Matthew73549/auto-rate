from app.database import SessionLocal
from app import models

db = SessionLocal()

prices = db.query(models.Price).all()
print(f"Всего записей Price: {len(prices)}")

for p in prices[:10]:
    print(f"service_id={p.service_id}, city_id={p.city_id}, price_avg={p.price_avg}")

db.close()