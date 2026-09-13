from app.database import SessionLocal, engine, Base
from app import models

Base.metadata.create_all(bind=engine)
db = SessionLocal()

# === АВТОМОБИЛИ ===
cars_data = [
    # (id, brand, model, generation, year_from, year_to)
    (1, "Toyota", "Camry", "XV70", 2017, 2023),
    (2, "Toyota", "Corolla", "E210", 2018, 2023),
    (3, "Toyota", "RAV4", "XA50", 2018, 2023),
    (4, "Hyundai", "Solaris", "HC", 2017, 2023),
    (5, "Hyundai", "Creta", "AX", 2016, 2023),
    (6, "Kia", "Rio", "FB", 2017, 2023),
    (7, "Kia", "Sportage", "QL", 2016, 2023),
    (8, "Volkswagen", "Polo", "6R", 2017, 2023),
    (9, "Volkswagen", "Tiguan", "5N", 2017, 2023),
    (10, "Skoda", "Octavia", "NE", 2017, 2023),
    (11, "Skoda", "Rapid", "NH", 2017, 2023),
    (12, "Renault", "Logan", "L9", 2017, 2023),
    (13, "Renault", "Duster", "HS", 2017, 2023),
    (14, "Lada", "Vesta", "SW", 2017, 2023),
    (15, "Lada", "Granta", "II", 2018, 2023),
    (16, "BMW", "X5", "G05", 2018, 2023),
    (17, "Mercedes-Benz", "E-Class", "W213", 2016, 2023),
    (18, "Audi", "Q7", "4M", 2017, 2023),
    (19, "Mazda", "CX-5", "KF", 2017, 2023),
    (20, "Nissan", "Qashqai", "J11", 2017, 2023),
]

for car_id, brand, model, generation, year_from, year_to in cars_data:
    exists = db.query(models.Car).filter(models.Car.id == car_id).first()
    if not exists:
        db.add(models.Car(
            id=car_id,
            brand=brand,
            model=model,
            generation=generation,
            year_from=year_from,
            year_to=year_to,
        ))

db.commit()
print(f"Добавлено {len(cars_data)} автомобилей")

db.close()