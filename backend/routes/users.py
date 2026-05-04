from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import timedelta
from backend.database import get_db
from backend.models import User
from backend.schemas import UserCreate, UserOut, TokenWithRefresh
from backend.utils.hashing import hash_password, verify_password
from backend.security import (
    create_access_token, create_refresh_token,
    get_current_user, require_admin, _decode_token
)
from backend.configs import settings
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/register", response_model=UserOut)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_pwd = hash_password(user_in.password)
    user = User(
        name=user_in.name,
        email=user_in.email,
        phone=user_in.phone,
        hashed_password=hashed_pwd
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token({"sub": str(user.id), "role": user.role})
    refresh_token = create_refresh_token({"sub": str(user.id)})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@router.get("/{user_id}", response_model=UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/make-admin/{user_id}")
def make_user_admin(
    user_id: int,
    admin=Depends(require_admin),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_admin = True
    db.commit()
    db.refresh(user)
    return {"message": f"User {user.name} is now an admin", "user_id": user.id}


@router.post("/logout")
def logout(current_user: User = Depends(get_current_user)):
    return {"message": "Successfully logged out"}


# ── Password Reset ────────────────────────────────────────────────────────────

@router.post("/password-reset/request")
def request_password_reset(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    # Always return 200 to avoid leaking which emails are registered
    if not user:
        return {"message": "If that email is registered, a reset link has been sent."}

    # Generate a short-lived JWT as the reset token (15 minutes)
    reset_token = create_access_token(
        {"sub": str(user.id), "purpose": "password_reset"},
        expires_minutes=15
    )

    # Try to send email — silently skip if SMTP not configured
    try:
        import smtplib
        from email.message import EmailMessage
        reset_link = f"http://localhost:5173/reset-password?token={reset_token}"
        msg = EmailMessage()
        msg["Subject"] = "Tayyab Jewellers — Password Reset"
        msg["From"] = settings.SMTP_FROM
        msg["To"] = user.email
        msg.set_content(
            f"Hi {user.name},\n\n"
            f"Click the link below to reset your password (valid for 15 minutes):\n\n"
            f"{reset_link}\n\n"
            f"If you did not request this, ignore this email.\n\n"
            f"— Tayyab Jewellers"
        )
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as s:
            if settings.SMTP_USER:
                s.starttls()
                s.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            s.send_message(msg)
    except Exception:
        pass

    return {
        "message": "If that email is registered, a reset link has been sent.",
        "dev_token": reset_token  # remove this line in production
    }


@router.post("/password-reset/confirm")
def confirm_password_reset(token: str, new_password: str, db: Session = Depends(get_db)):
    try:
        payload = _decode_token(token)
    except HTTPException:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")

    if payload.get("purpose") != "password_reset":
        raise HTTPException(status_code=400, detail="Invalid token purpose")

    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if len(new_password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    user.hashed_password = hash_password(new_password)
    db.commit()
    return {"message": "Password reset successfully. You can now log in."}
