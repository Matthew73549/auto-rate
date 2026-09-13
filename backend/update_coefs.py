import sqlite3

DATABASE = 'auto_rate.db'

conn = sqlite3.connect(DATABASE)
cursor = conn.cursor()

# === КОЭФФИЦИЕНТЫ ===

# Mileage (пробег)
cursor.execute("UPDATE mileage SET coef = 1.0 WHERE label = 'under_50k'")
cursor.execute("UPDATE mileage SET coef = 1.1 WHERE label = '50k_100k'")
cursor.execute("UPDATE mileage SET coef = 1.2 WHERE label = 'over_100k'")

# Age (возраст)
cursor.execute("UPDATE age SET coef = 1.0 WHERE label = 'under_3'")
cursor.execute("UPDATE age SET coef = 1.05 WHERE label = '3_7'")
cursor.execute("UPDATE age SET coef = 1.1 WHERE label = 'over_7'")

# Access (доступ)
cursor.execute("UPDATE access SET coef = 1.0 WHERE label = 'normal'")
cursor.execute("UPDATE access SET coef = 1.15 WHERE label = 'medium'")
cursor.execute("UPDATE access SET coef = 1.3 WHERE label = 'difficult'")

# Urgency (срочность)
cursor.execute("UPDATE urgency SET coef = 1.0 WHERE label = 'normal'")
cursor.execute("UPDATE urgency SET coef = 1.1 WHERE label = 'urgent'")
cursor.execute("UPDATE urgency SET coef = 1.2 WHERE label = 'very_urgent'")

# Tool (инструмент)
cursor.execute("UPDATE tool SET coef = 1.0 WHERE label = 'none'")
cursor.execute("UPDATE tool SET coef = 1.1 WHERE label = 'special'")
cursor.execute("UPDATE tool SET coef = 1.2 WHERE label = 'dealer'")

# === УСЛУГИ (базовые цены 2026) ===

cursor.execute("UPDATE services SET base_price = 1200, labor_time = 0.5 WHERE name = 'Компьютерная диагностика'")
cursor.execute("UPDATE services SET base_price = 2500, labor_time = 1.0 WHERE name = 'Замена масла'")
cursor.execute("UPDATE services SET base_price = 3000, labor_time = 1.5 WHERE name = 'Замена тормозных колодок'")

conn.commit()
conn.close()

print('✅ Коэффициенты и цены обновлены!')
print()
print('Итоговые коэффициенты:')
print('- Пробег: 1.0 / 1.1 / 1.2')
print('- Возраст: 1.0 / 1.05 / 1.1')
print('- Доступ: 1.0 / 1.15 / 1.3')
print('- Срочность: 1.0 / 1.1 / 1.2')
print('- Инструмент: 1.0 / 1.1 / 1.2')
print()
print('Цены на услуги:')
print('- Диагностика: 1 200 ₽ (0.5 ч)')
print('- Замена масла: 2 500 ₽ (1.0 ч)')
print('- Замена колодок: 3 000 ₽ (1.5 ч)')