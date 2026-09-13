from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import bcrypt
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

DATABASE = 'auto_rate.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/services', methods=['GET'])
def get_services():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    search = request.args.get('search', '')
    category = request.args.get('category', '')
    
    query = 'SELECT id, name, labor_time, base_price FROM services WHERE 1=1'
    params = []
    
    if search:
        query += ' AND name LIKE ?'
        params.append(f'%{search}%')
    
    if category:
        query += ' AND name LIKE ?'
        params.append(f'%{category}%')
    
    cursor.execute(query, params)
    services = [dict(row) for row in cursor.fetchall()]
    
    conn.close()
    
    return jsonify(services)

@app.route('/api/data', methods=['GET'])
def get_data():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT id, name FROM services')
    services = [{'id': row['id'], 'name': row['name']} for row in cursor.fetchall()]
    
    cursor.execute('SELECT id, name FROM city')
    cities = [{'id': row['id'], 'name': row['name']} for row in cursor.fetchall()]
    
    cursor.execute('SELECT label FROM mileage')
    mileage = [row['label'] for row in cursor.fetchall()]
    
    cursor.execute('SELECT label FROM age')
    age = [row['label'] for row in cursor.fetchall()]
    
    cursor.execute('SELECT label FROM access')
    access = [row['label'] for row in cursor.fetchall()]
    
    cursor.execute('SELECT label FROM urgency')
    urgency = [row['label'] for row in cursor.fetchall()]
    
    cursor.execute('SELECT label FROM tool')
    tool = [row['label'] for row in cursor.fetchall()]
    
    conn.close()
    
    return jsonify({
        'services': services,
        'cities': cities,
        'mileage': mileage,
        'age': age,
        'access': access,
        'urgency': urgency,
        'tool': tool
    })

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    full_name = data.get('full_name')
    phone = data.get('phone')
    user_type = data.get('user_type')
    inn = data.get('inn')
    company_name = data.get('company_name')
    city = data.get('city')
    address = data.get('address')
    
    if not all([email, password]):
        return jsonify({'error': 'Email и пароль обязательны'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT id FROM users WHERE email = ?', (email,))
    if cursor.fetchone():
        conn.close()
        return jsonify({'error': 'Email уже зарегистрирован'}), 409
    
    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    trial_end = datetime.now() + timedelta(days=7)
    
    cursor.execute('''
        INSERT INTO users (email, password_hash, full_name, phone, subscription_end, trial_start, 
                          user_type, inn, company_name, city, address)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (email, password_hash, full_name, phone, trial_end, datetime.now(),
          user_type, inn, company_name, city, address))
    
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    
    return jsonify({'id': new_id, 'message': 'Пользователь зарегистрирован'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if not all([email, password]):
        return jsonify({'error': 'Email и пароль обязательны'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
    user = cursor.fetchone()
    conn.close()
    
    if not user:
        return jsonify({'error': 'Неверный email или пароль'}), 401
    
    if not bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
        return jsonify({'error': 'Неверный email или пароль'}), 401
    
    return jsonify({
        'id': user['id'],
        'email': user['email'],
        'full_name': user['full_name'] if user['full_name'] else '',
        'subscription_end': user['subscription_end'] if user['subscription_end'] else ''
    }), 200

@app.route('/api/profile', methods=['GET'])
def get_profile():
    user_id = request.args.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'user_id обязателен'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
    user = cursor.fetchone()
    conn.close()
    
    if not user:
        return jsonify({'error': 'Пользователь не найден'}), 404
    
    return jsonify({
        'id': user['id'],
        'email': user['email'],
        'full_name': user['full_name'] if user['full_name'] else '',
        'phone': user['phone'] if user['phone'] else '',
        'user_type': user['user_type'] if user['user_type'] else '',
        'inn': user['inn'] if user['inn'] else '',
        'city': user['city'] if user['city'] else '',
        'address': user['address'] if user['address'] else '',
        'company_name': user['company_name'] if user['company_name'] else '',
        'subscription_end': user['subscription_end'] if user['subscription_end'] else ''
    }), 200

@app.route('/api/profile', methods=['PUT'])
def update_profile():
    data = request.json
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'user_id обязателен'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        UPDATE users 
        SET full_name = ?, phone = ?, user_type = ?, inn = ?, 
            city = ?, address = ?, company_name = ?
        WHERE id = ?
    ''', (
        data.get('full_name'),
        data.get('phone'),
        data.get('user_type'),
        data.get('inn'),
        data.get('city'),
        data.get('address'),
        data.get('company_name'),
        user_id
    ))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Профиль обновлён'}), 200

@app.route('/api/calculate', methods=['POST'])
def calculate():
    data = request.json
    
    service_id = data.get('service_id')
    city_id = data.get('city_id')
    mileage = data.get('mileage')
    age = data.get('age')
    access = data.get('access')
    urgency = data.get('urgency')
    tool = data.get('tool')
    user_id = data.get('user_id')
    
    if not all([service_id, city_id, mileage, age, access, urgency, tool]):
        return jsonify({'error': 'Все поля обязательны'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT labor_time, base_price FROM services WHERE id = ?', (service_id,))
    service = cursor.fetchone()
    if not service:
        conn.close()
        return jsonify({'error': 'Услуга не найдена'}), 404
    labor_time = service['labor_time']
    base_price = service['base_price']
    
    cursor.execute('SELECT coef FROM city WHERE id = ?', (city_id,))
    city_row = cursor.fetchone()
    city_coef = city_row['coef'] if city_row else 1.0
    
    cursor.execute('SELECT coef FROM mileage WHERE label = ?', (mileage,))
    mileage_row = cursor.fetchone()
    mileage_coef = mileage_row['coef'] if mileage_row else 1.0
    
    cursor.execute('SELECT coef FROM age WHERE label = ?', (age,))
    age_row = cursor.fetchone()
    age_coef = age_row['coef'] if age_row else 1.0
    
    cursor.execute('SELECT coef FROM access WHERE label = ?', (access,))
    access_row = cursor.fetchone()
    access_coef = access_row['coef'] if access_row else 1.0
    
    cursor.execute('SELECT coef FROM urgency WHERE label = ?', (urgency,))
    urgency_row = cursor.fetchone()
    urgency_coef = urgency_row['coef'] if urgency_row else 1.0
    
    cursor.execute('SELECT coef FROM tool WHERE label = ?', (tool,))
    tool_row = cursor.fetchone()
    tool_coef = tool_row['coef'] if tool_row else 1.0
    
    conn.close()
    
    total_coef = city_coef * mileage_coef * age_coef * access_coef * urgency_coef * tool_coef
    total_price = base_price * total_coef
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO calculation_history 
        (user_id, service_id, city_id, mileage, age, access, urgency, tool, 
         labor_time, base_price, total_coef, total_price)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        user_id,
        service_id,
        city_id,
        mileage,
        age,
        access,
        urgency,
        tool,
        labor_time,
        base_price,
        total_coef,
        total_price
    ))
    conn.commit()
    conn.close()
    
    return jsonify({
        'service_id': service_id,
        'city_id': city_id,
        'labor_time': labor_time,
        'base_price': base_price,
        'coef_mileage': mileage_coef,
        'coef_age': age_coef,
        'coef_access': access_coef,
        'coef_urgency': urgency_coef,
        'coef_tool': tool_coef,
        'total_coef': round(total_coef, 2),
        'total_price': round(total_price, 2)
    })

@app.route('/api/history', methods=['GET'])
def get_history():
    user_id = request.args.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'user_id обязателен'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT ch.*, s.name as service_name, c.name as city_name
        FROM calculation_history ch
        JOIN services s ON ch.service_id = s.id
        JOIN city c ON ch.city_id = c.id
        WHERE ch.user_id = ?
        ORDER BY ch.created_at DESC
        LIMIT 50
    ''', (user_id,))
    
    rows = cursor.fetchall()
    history = [dict(row) for row in rows]
    
    conn.close()
    
    return jsonify(history)

@app.route('/api/history', methods=['POST'])
def save_history():
    data = request.json
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO calculation_history 
        (service_id, city_id, mileage, age, access, urgency, tool, 
         labor_time, base_price, total_coef, total_price)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        data['service_id'],
        data['city_id'],
        data['mileage'],
        data['age'],
        data['access'],
        data['urgency'],
        data['tool'],
        data['labor_time'],
        data['base_price'],
        data['total_coef'],
        data['total_price']
    ))
    
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    
    return jsonify({'id': new_id, 'message': 'Расчёт сохранён'}), 201

if __name__ == '__main__':
    app.run(debug=True, port=5000)