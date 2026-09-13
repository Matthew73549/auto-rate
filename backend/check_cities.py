from app.database import SessionLocal
from app import models

db = SessionLocal()

cities = db.query(models.City).all()
print(f"Всего городов: {len(cities)}")
for c in cities:
    print(f"id={c.id}, name={c.name}")

db.close()
