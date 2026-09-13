import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://autorat:autoratpass@localhost:5432/autorat")
SECRET_KEY = os.getenv("SECRET_KEY", "change-me-to-random-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
REFRESH_TOKEN_EXPIRE_DAYS = 30

DEFAULT_CITY = "Москва"
SUPPORT_EMAIL = "akhmed.mikhaltsov@inbox.ru"
PROJECT_NAME = "AutoRate"
