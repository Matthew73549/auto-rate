import sqlite3

conn = sqlite3.connect('auto_rate.db')
cursor = conn.cursor()

print('=== SERVICES ===')
cursor.execute('SELECT * FROM services')
for row in cursor.fetchall():
    print(row)

print('\n=== CITY ===')
cursor.execute('SELECT * FROM city')
for row in cursor.fetchall():
    print(row)

conn.close()