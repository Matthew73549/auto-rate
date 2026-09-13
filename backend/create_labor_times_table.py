import sqlite3

# Подключение к базе
conn = sqlite3.connect('auto_rate.db')
cursor = conn.cursor()

# Создание таблицы нормативов времени
cursor.execute('''
CREATE TABLE IF NOT EXISTS labor_times (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_id INTEGER REFERENCES services(id),
    car_make TEXT NOT NULL,
    car_model TEXT NOT NULL,
    generation TEXT,
    year_from INTEGER,
    year_to INTEGER,
    engine_type TEXT,
    operation_name TEXT NOT NULL,
    labor_hours REAL NOT NULL,
    difficulty_class TEXT,
    notes TEXT,
    source TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
''')

# Создание индексов для быстрого поиска
cursor.execute('CREATE INDEX IF NOT EXISTS idx_labor_service ON labor_times(service_id)')
cursor.execute('CREATE INDEX IF NOT EXISTS idx_labor_car ON labor_times(car_make, car_model)')
cursor.execute('CREATE INDEX IF NOT EXISTS idx_labor_operation ON labor_times(operation_name)')

conn.commit()
conn.close()

print("Таблица labor_times создана успешно!")