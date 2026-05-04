from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Product
from backend.schemas import ProductCreate, ProductOut, ProductFilter
from backend.security import require_admin
from backend.services.cache import cache_response
import os, shutil

UPLOAD_DIR = "uploads/products"
os.makedirs(UPLOAD_DIR, exist_ok=True)

router = APIRouter(prefix="/products", tags=["products"])


@router.get("/", response_model=list[ProductOut])
def list_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    return db.query(Product).offset(skip).limit(limit).all()


@router.get("/search", response_model=list[ProductOut])
def search_products(
    query: str = None,
    filters: ProductFilter = Depends(),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    q = db.query(Product)
    if query:
        q = q.filter(
            Product.name.ilike(f"%{query}%") |
            Product.description.ilike(f"%{query}%")
        )
    if filters.min_price:
        q = q.filter(Product.price >= filters.min_price)
    if filters.max_price:
        q = q.filter(Product.price <= filters.max_price)
    if filters.metal_type:
        q = q.filter(Product.metal_type == filters.metal_type)
    if filters.karat:
        q = q.filter(Product.karat == filters.karat)
    if filters.category:
        q = q.filter(Product.category == filters.category)
    if filters.in_stock:
        q = q.filter(Product.stock_quantity > 0)
    return q.offset(skip).limit(limit).all()


@router.get("/{product_id}", response_model=ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("/", response_model=ProductOut)
def create_product(
    prod_in: ProductCreate,
    admin=Depends(require_admin),
    db: Session = Depends(get_db)
):
    product = Product(**prod_in.dict())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.post("/upload-image/{product_id}")
async def upload_product_image(
    product_id: int,
    file: UploadFile = File(...),
    admin=Depends(require_admin),
    db: Session = Depends(get_db)
):
    ext = file.filename.rsplit(".", 1)[-1].lower()
    if ext not in ("jpg", "jpeg", "png", "webp"):
        raise HTTPException(400, "Invalid file type")
    filename = f"{product_id}.{ext}"
    path = os.path.join(UPLOAD_DIR, filename)
    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(404, "Product not found")
    product.images = filename
    db.commit()
    db.refresh(product)
    return {"url": f"/uploads/products/{filename}", "filename": filename}
