# backend/routes/cart.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from backend import models, schemas
from backend.database import get_db
from backend.security import get_current_user

router = APIRouter(prefix="/api/cart", tags=["Cart"])


@router.get("/", response_model=List[schemas.CartItemResponse])
async def get_cart_items(
        db: Session = Depends(get_db),
        current_user: models.User = Depends(get_current_user)
):
    """Get all items in user's cart"""
    cart_items = db.query(models.Cart).filter(
        models.Cart.user_id == current_user.id
    ).all()
    return cart_items


@router.post("/", response_model=schemas.CartItemResponse)
async def add_to_cart(
        item: schemas.CartCreate,
        db: Session = Depends(get_db),
        current_user: models.User = Depends(get_current_user)
):
    """Add product to cart"""
    # Check if product exists
    product = db.query(models.Product).filter(
        models.Product.id == item.product_id
    ).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Check if item already in cart
    existing = db.query(models.Cart).filter(
        models.Cart.user_id == current_user.id,
        models.Cart.product_id == item.product_id
    ).first()

    if existing:
        existing.quantity += item.quantity
        db.commit()
        db.refresh(existing)
        return existing

    # Create new cart item
    cart_item = models.Cart(
        user_id=current_user.id,
        product_id=item.product_id,
        quantity=item.quantity
    )
    db.add(cart_item)
    db.commit()
    db.refresh(cart_item)
    return cart_item


@router.put("/{item_id}", response_model=schemas.CartItemResponse)
async def update_cart_item(
        item_id: int,
        item_update: schemas.CartUpdate,
        db: Session = Depends(get_db),
        current_user: models.User = Depends(get_current_user)
):
    """Update cart item quantity"""
    cart_item = db.query(models.Cart).filter(
        models.Cart.id == item_id,
        models.Cart.user_id == current_user.id
    ).first()

    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    cart_item.quantity = item_update.quantity
    db.commit()
    db.refresh(cart_item)
    return cart_item


@router.delete("/{item_id}")
async def remove_from_cart(
        item_id: int,
        db: Session = Depends(get_db),
        current_user: models.User = Depends(get_current_user)
):
    """Remove item from cart"""
    cart_item = db.query(models.Cart).filter(
        models.Cart.id == item_id,
        models.Cart.user_id == current_user.id
    ).first()

    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    db.delete(cart_item)
    db.commit()
    return {"message": "Item removed from cart"}