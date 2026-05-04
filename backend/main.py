# app/main.py
from fastapi import FastAPI
from backend.database import engine, Base
from backend import models  # ensures models are registered with SQLAlchemy
from backend.configs import settings
from backend.routes import (
    auth,
    users,
    products,
    orders,
    payments,
    rates,
    history,
    admin,
    inventory,
    wishlist,
    address,
    profile,
    cart,
    notify
)
from fastapi.middleware.cors import CORSMiddleware

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI application
app = FastAPI(
    title="Tayyab Jewellers API",
    description="Backend API for Tayyab Jewellers E-commerce Platform",
    version="1.0.0"
)
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(payments.router)
app.include_router(rates.router)
app.include_router(history.router)
app.include_router(inventory.router)
app.include_router(profile.router)
app.include_router(address.router)
app.include_router(wishlist.router)
app.include_router(cart.router)
app.include_router(notify.router)

@app.get("/")
def root():
    return {
        "status": "ok",
        "project": "Tayyab Jewellers Backend",
        "version": "1.0.0",
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "null",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
