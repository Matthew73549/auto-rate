import sys
sys.path.insert(0, "app")

from sqlalchemy import create_engine, text

DATABASE_URL = "sqlite:///./auto_rate.db"
engine = create_engine(DATABASE_URL)

with engine.connect() as conn:
    result = conn.execute(text("SELECT DISTINCT category FROM services"))
    categories = [row[0] for row in result]
    print(categories)