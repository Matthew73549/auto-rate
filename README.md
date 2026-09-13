# AutoRate — сервис расчёта стоимости ремонта авто

## Структура

- `backend/` — FastAPI (Python 3.11)
- `frontend/` — Next.js + TypeScript

## Быстрый старт (локально)

### 1. Бэкенд

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Бэкенд будет доступен по: http://localhost:8000  
Swagger: http://localhost:8000/docs

### 2. Фронтенд

```bash
cd frontend
npm install
npm run dev
```

Фронтенд: http://localhost:3000

### 3. Первый вход

- Зарегистрируйся на `/register`
- Первый пользователь автоматически становится админом
- Админка: `/admin`

## Что дальше

- Добавить реальные города и цены через админку
- Подключить платёжку (ЮKassa / CloudPayments)
- Настроить хостинг (бэкенд + фронтенд + БД)