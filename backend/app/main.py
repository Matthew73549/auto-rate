from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base
from .routers import auth, services, prices, calculator, cars, vin, admin
from .config import PROJECT_NAME

Base.metadata.create_all(bind=engine)

app = FastAPI(title=PROJECT_NAME)

# CORS для локальной разработки
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "https://autorate.tech"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(services.router, prefix="/api")
app.include_router(prices.router, prefix="/api")
app.include_router(calculator.router, prefix="/api")
app.include_router(cars.router, prefix="/api")
app.include_router(vin.router, prefix="/api")
app.include_router(admin.router, prefix="/api")


@app.get("/")
def root():
    return {"service": PROJECT_NAME, "status": "ok"}