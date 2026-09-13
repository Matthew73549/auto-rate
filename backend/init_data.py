from app.database import SessionLocal
from app.init_db import init_db

if __name__ == "__main__":
    db = SessionLocal()
    try:
        init_db(db)
        print("Database initialized.")
    finally:
        db.close()