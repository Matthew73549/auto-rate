import sqlite3

DATABASE = 'auto_rate.db'

conn = sqlite3.connect(DATABASE)
cursor = conn.cursor()

# Исправляем mileage
cursor.execute("UPDATE mileage SET label = 'under_50k' WHERE label = 'До 50 тыс. км'")
cursor.execute("UPDATE mileage SET label = '50k_100k' WHERE label = '50-100 тыс. км'")
cursor.execute("UPDATE mileage SET label = 'over_100k' WHERE label = 'Более 100 тыс. км'")

# Исправляем age
cursor.execute("UPDATE age SET label = 'under_3' WHERE label = 'До 3 лет'")
cursor.execute("UPDATE age SET label = '3_7' WHERE label = '3-7 лет'")
cursor.execute("UPDATE age SET label = 'over_7' WHERE label = 'Более 7 лет'")

# Исправляем access
cursor.execute("UPDATE access SET label = 'normal' WHERE label = 'Легкий'")
cursor.execute("UPDATE access SET label = 'medium' WHERE label = 'Средний'")
cursor.execute("UPDATE access SET label = 'difficult' WHERE label = 'Сложный'")

# Исправляем urgency
cursor.execute("UPDATE urgency SET label = 'normal' WHERE label = 'Обычная'")
cursor.execute("UPDATE urgency SET label = 'urgent' WHERE label = 'Срочная'")
cursor.execute("UPDATE urgency SET label = 'very_urgent' WHERE label = 'Очень срочная'")

# Исправляем tool
cursor.execute("UPDATE tool SET label = 'none' WHERE label = 'Стандартный'")
cursor.execute("UPDATE tool SET label = 'special' WHERE label = 'Спец. инструмент'")
cursor.execute("UPDATE tool SET label = 'dealer' WHERE label = 'Дилерский'")

conn.commit()
conn.close()

print('Данные исправлены!')