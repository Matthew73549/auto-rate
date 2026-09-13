import sqlite3

DATABASE = 'auto_rate.db'

conn = sqlite3.connect(DATABASE)
cursor = conn.cursor()

# Добавляем новые поля в таблицу users
try:
    cursor.execute('ALTER TABLE users ADD COLUMN user_type TEXT')  # 'individual' / 'service'
    cursor.execute('ALTER TABLE users ADD COLUMN inn TEXT')
    cursor.execute('ALTER TABLE users ADD COLUMN city TEXT')
    cursor.execute('ALTER TABLE users ADD COLUMN address TEXT')
    cursor.execute('ALTER TABLE users ADD COLUMN company_name TEXT')
    print('✅ Поля добавлены!')
except Exception as e:
    print(f'⚠️ Поля уже существуют или ошибка: {e}')

conn.commit()
conn.close()