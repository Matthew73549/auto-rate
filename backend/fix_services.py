import sqlite3

DATABASE = 'auto_rate.db'

conn = sqlite3.connect(DATABASE)
cursor = conn.cursor()

# Исправляем услуги
cursor.execute("UPDATE services SET name = 'Компьютерная диагностика', base_price = 1200, labor_time = 0.5 WHERE name = 'Диагностика двигателя'")

# Исправляем города
cursor.execute("UPDATE city SET coef = 1.2 WHERE name = 'Москва'")
cursor.execute("UPDATE city SET coef = 1.15 WHERE name = 'Санкт-Петербург'")

conn.commit()
conn.close()

print('✅ Услуги и города исправлены!')
print()
print('Теперь:')
print('- Компьютерная диагностика: 1 200 ₽ (0.5 ч)')
print('- Москва: coef 1.2')
print('- Санкт-Петербург: coef 1.15')