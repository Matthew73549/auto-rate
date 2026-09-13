from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from .. import models, schemas, auth
from ..database import get_db
import datetime as dt

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=schemas.UserResponse)
def register(user_in: schemas.UserRegister, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = auth.hash_password(user_in.password)
    db_user = models.User(
        email=user_in.email,
        password_hash=hashed_pw,
        city=user_in.city,
        role=user_in.role,
        inn=user_in.inn,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return schemas.UserResponse(
        id=db_user.id,
        email=db_user.email,
        city=db_user.city,
        role=db_user.role,
        subscription_status=db_user.subscription_status,
        subscription_end=db_user.subscription_end,
    )

@router.post("/login", response_model=schemas.Token)
def login(user_in: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if not user or not auth.verify_password(user_in.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    now = dt.datetime.utcnow()
    if user.subscription_status == "trial":
        trial_end = user.trial_start + dt.timedelta(days=7)
        if now > trial_end:
            user.subscription_status = "expired"
            db.commit()
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Trial period expired. Please subscribe.")
    elif user.subscription_status == "active":
        if user.subscription_end and now > user.subscription_end:
            user.subscription_status = "expired"
            db.commit()
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Subscription expired. Please renew.")
    elif user.subscription_status == "expired":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied. Subscription expired.")

    access_token = auth.create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    refresh_token = auth.create_refresh_token(data={"sub": user.email})

    return schemas.Token(access_token=access_token, refresh_token=refresh_token)

@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(auth.get_current_user)):
    return schemas.UserResponse(
        id=current_user.id,
        email=current_user.email,
        city=current_user.city,
        role=current_user.role,
        subscription_status=current_user.subscription_status,
        subscription_end=current_user.subscription_end,
    )