import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "auto_rate.db"

conn = sqlite3.connect(str(DB_PATH))
cur = conn.cursor()

services = [
    ("Замена масла", "ТО", "Замена моторного масла", 30, 1.0),
    ("Замена тормозных колодок", "Тормоза", "Замена передних/задних колодок", 60, 1.2),
    ("Диагностика двигателя", "Диагностика", "Компьютерная диагностика", 45, 1.1),
]

cur.executemany(
    """
    INSERT INTO services (name, category, description, base_time_minutes, complexity_factor)
    VALUES (?, ?, ?, ?, ?)
    """,
    services,
)

conn.commit()
print(f"Добавлено услуг: {cur.rowcount}")
conn.close()