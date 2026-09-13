import sqlite3

conn = sqlite3.connect('auto_rate.db')
cursor = conn.cursor()

# Пересоздаём таблицу services
cursor.execute('DROP TABLE IF EXISTS services')
cursor.execute('''
CREATE TABLE services (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    labor_time REAL NOT NULL,
    base_price REAL NOT NULL
)
''')

cursor.executemany('INSERT INTO services (id, name, labor_time, base_price) VALUES (?, ?, ?, ?)', [
    (1, 'Замена масла', 1.0, 2000),
    (2, 'Замена тормозных колодок', 1.5, 3000),
    (3, 'Диагностика двигателя', 2.0, 4000)
])

# Пересоздаём таблицу city
cursor.execute('DROP TABLE IF EXISTS city')
cursor.execute('''
CREATE TABLE city (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    coef REAL NOT NULL
)
''')

cursor.executemany('INSERT INTO city (id, name, coef) VALUES (?, ?, ?)', [
    (1, 'Москва', 1.5),
    (2, 'Санкт-Петербург', 1.3),
    (3, 'Казань', 1.0)
])

conn.commit()
conn.close()
print("Готово!")