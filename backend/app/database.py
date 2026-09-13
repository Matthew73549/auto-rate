import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql://auto_rate_db_user:IZetKlLWiQNI9TEDCx2lYvz6YhH81Rnh@dpg-daj5dqmq1p3s73a6m6e0-a/auto_rate_db"

print(f"DEBUG: DATABASE_URL = {DATABASE_URL}")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
