import sqlite3

DATABASE = 'auto_rate.db'

conn = sqlite3.connect(DATABASE)
cursor = conn.cursor()

# Таблица пользователей (полная версия)
cursor.execute('''
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    phone TEXT,
    full_name TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subscription_end DATE,
    trial_start DATE,
    is_trial_used BOOLEAN DEFAULT FALSE,
    user_type TEXT,
    inn TEXT,
    city TEXT,
    address TEXT,
    company_name TEXT
)
''')

# Таблица истории расчётов
cursor.execute('''
CREATE TABLE IF NOT EXISTS calculation_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id),
    service_id INTEGER,
    city_id INTEGER,
    mileage TEXT,
    age TEXT,
    access TEXT,
    urgency TEXT,
    tool TEXT,
    labor_time REAL,
    base_price REAL,
    total_coef REAL,
    total_price REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
''')

# Таблица платежей
cursor.execute('''
CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id),
    amount REAL,
    tariff TEXT,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status TEXT
)
''')

conn.commit()
conn.close()

print('✅ Миграции применены!')