import sqlite3

conn = sqlite3.connect('auto_rate.db')
cursor = conn.cursor()

print('=== MILEAGE ===')
cursor.execute('SELECT * FROM mileage')
for row in cursor.fetchall():
    print(row)

print('\n=== AGE ===')
cursor.execute('SELECT * FROM age')
for row in cursor.fetchall():
    print(row)

print('\n=== ACCESS ===')
cursor.execute('SELECT * FROM access')
for row in cursor.fetchall():
    print(row)

print('\n=== URGENCY ===')
cursor.execute('SELECT * FROM urgency')
for row in cursor.fetchall():
    print(row)

print('\n=== TOOL ===')
cursor.execute('SELECT * FROM tool')
for row in cursor.fetchall():
    print(row)

conn.close()