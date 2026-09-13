from sqlalchemy.orm import Session
from .models import City, Service, Car, CarServiceStats

CITIES = [
    {"name": "Москва", "region": "Москва"},
    {"name": "Санкт-Петербург", "region": "Ленинградская обл."},
    {"name": "Краснодар", "region": "Краснодарский край"},
    {"name": "Ростов-на-Дону", "region": "Ростовская обл."},
    {"name": "Воронеж", "region": "Воронежская обл."},
    {"name": "Ярославль", "region": "Ярославская обл."},
    {"name": "Вологда", "region": "Вологодская обл."},
    {"name": "Кострома", "region": "Костромская обл."},
    {"name": "Сочи", "region": "Краснодарский край"},
]

SERVICES = [
    {
        "name": "Замена масла в двигателе",
        "category": "maintenance",
        "description": "Слив старого масла, замена фильтра, залив нового масла.",
        "base_time_minutes": 40,
        "complexity_factor": 1.0,
    },
    {
        "name": "Диагностика подвески",
        "category": "suspension",
        "description": "Проверка состояния рычагов, сайлентблоков, амортизаторов.",
        "base_time_minutes": 30,
        "complexity_factor": 1.0,
    },
    {
        "name": "Замена тормозных колодок (передних)",
        "category": "brakes",
        "description": "Снятие колеса, замена передних колодок, проверка тормозной системы.",
        "base_time_minutes": 50,
        "complexity_factor": 1.1,
    },
    {
        "name": "Замена свечей зажигания",
        "category": "engine",
        "description": "Демонтаж старых свечей, установка новых, проверка зазоров.",
        "base_time_minutes": 40,
        "complexity_factor": 1.0,
    },
    {
        "name": "Замена воздушного фильтра",
        "category": "maintenance",
        "description": "Замена фильтра системы впуска.",
        "base_time_minutes": 15,
        "complexity_factor": 1.0,
    },
    {
        "name": "Диагностика двигателя (компьютерная)",
        "category": "engine",
        "description": "Считывание ошибок, анализ параметров работы двигателя.",
        "base_time_minutes": 30,
        "complexity_factor": 1.0,
    },
    {
        "name": "Замена амортизаторов (передних, пара)",
        "category": "suspension",
        "description": "Снятие старых амортизаторов, установка новых, проверка геометрии.",
        "base_time_minutes": 120,
        "complexity_factor": 1.3,
    },
    {
        "name": "Замена сцепления",
        "category": "transmission",
        "description": "Демонтаж КПП, замена диска и корзины сцепления, сборка.",
        "base_time_minutes": 300,
        "complexity_factor": 1.6,
    },
    {
        "name": "Ремонт генератора",
        "category": "electrics",
        "description": "Разборка, замена щёток/подшипников, проверка output.",
        "base_time_minutes": 120,
        "complexity_factor": 1.3,
    },
    {
        "name": "Покраска детали кузова (локальная)",
        "category": "body",
        "description": "Подготовка, покраска, сушка одной детали (дверь, крыло и т.п.).",
        "base_time_minutes": 240,
        "complexity_factor": 1.5,
    },
]

CARS = [
    {"brand": "Lada", "model": "Vesta", "generation": "I", "year_from": 2015, "year_to": None},
    {"brand": "Lada", "model": "Granta", "generation": "I", "year_from": 2011, "year_to": None},
    {"brand": "Toyota", "model": "Camry", "generation": "XV70", "year_from": 2017, "year_to": None},
    {"brand": "Toyota", "model": "Corolla", "generation": "E210", "year_from": 2019, "year_to": None},
    {"brand": "Kia", "model": "Rio", "generation": "IV", "year_from": 2017, "year_to": None},
    {"brand": "Hyundai", "model": "Solaris", "generation": "II", "year_from": 2017, "year_to": None},
    {"brand": "Volkswagen", "model": "Polo", "generation": "VI", "year_from": 2020, "year_to": None},
    {"brand": "Skoda", "model": "Rapid", "generation": "I", "year_from": 2012, "year_to": 2020},
    {"brand": "Renault", "model": "Duster", "generation": "I", "year_from": 2010, "year_to": 2021},
    {"brand": "Renault", "model": "Kaptur", "generation": "I", "year_from": 2016, "year_to": None},
]

CAR_SERVICE_EXAMPLES = [
    ("Lada", "Vesta", "Замена масла в двигателе", 9, "Базовая ТО‑работа"),
    ("Lada", "Vesta", "Замена тормозных колодок (передних)", 8, "Частая работа"),
    ("Lada", "Granta", "Замена масла в двигателе", 9, "Базовая ТО‑работа"),
    ("Toyota", "Camry", "Замена масла в двигателе", 9, "Базовая ТО‑работа"),
    ("Toyota", "Camry", "Замена свечей зажигания", 7, "Раз в 60–100 тыс. км"),
    ("Kia", "Rio", "Замена масла в двигателе", 9, "Базовая ТО‑работа"),
    ("Hyundai", "Solaris", "Замена масла в двигателе", 9, "Базовая ТО‑работа"),
    ("Volkswagen", "Polo", "Замена масла в двигателе", 9, "Базовая ТО‑работа"),
    ("Renault", "Duster", "Замена масла в двигателе", 9, "Базовая ТО‑работа"),
    ("Renault", "Kaptur", "Замена масла в двигателе", 9, "Базовая ТО‑работа"),
]

def init_db(db: Session):
    # Города
    for c in CITIES:
        existing = db.query(City).filter(City.name == c["name"]).first()
        if not existing:
            db.add(City(name=c["name"], region=c["region"]))
    db.commit()

    # Услуги
    for s in SERVICES:
        existing = db.query(Service).filter(Service.name == s["name"]).first()
        if not existing:
            db.add(Service(**s))
    db.commit()

    # Машины
    for c in CARS:
        existing = db.query(Car).filter(
            Car.brand == c["brand"],
            Car.model == c["model"],
            Car.generation == c["generation"],
        ).first()
        if not existing:
            db.add(Car(**c))
    db.commit()

    # CarServiceStats
    for brand, model, service_name, freq, notes in CAR_SERVICE_EXAMPLES:
        car = db.query(Car).filter(Car.brand == brand, Car.model == model).first()
        service = db.query(Service).filter(Service.name == service_name).first()
        if not car or not service:
            continue
        existing = db.query(CarServiceStats).filter(
            CarServiceStats.car_id == car.id,
            CarServiceStats.service_id == service.id,
        ).first()
        if not existing:
            db.add(
                CarServiceStats(
                    car_id=car.id,
                    service_id=service.id,
                    frequency_score=freq,
                    notes=notes,
                )
            )
    db.commit()