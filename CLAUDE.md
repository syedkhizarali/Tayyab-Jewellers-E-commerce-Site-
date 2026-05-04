# Tayyab Jewellers Web API — CLAUDE.md

## Project Overview
Full-stack Pakistani jewellery e-commerce platform. FastAPI backend (Python) + React frontend (Vite).  
Owner: Syed Khizar Ali | GitHub: https://github.com/syedkhizarali/Tayyab-Jewellers-Web-API

---

## Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI, SQLAlchemy, MySQL (MariaDB) |
| Auth | PyJWT (HS256), OAuth2PasswordBearer |
| Frontend | React 18, Vite, Bootstrap 5, React Router v6 |
| State | React Context API (Auth, Cart, Wishlist) |
| Data fetching | Axios (with auto-token interceptors) |
| Forms | React Hook Form |
| Notifications | React Toastify |

---

## Project Structure

```
Tayyab-Jewellers-Web-API/
├── backend/              # FastAPI application
│   ├── main.py           # App entry point, CORS, route registration
│   ├── database.py       # SQLAlchemy engine + session
│   ├── models.py         # ORM models (11 models)
│   ├── schemas.py        # Pydantic schemas + enums
│   ├── security.py       # JWT helpers, require_admin()
│   ├── configs.py        # Settings from .env
│   ├── routes/           # API endpoint routers (13 modules)
│   ├── services/         # Business logic (email, analytics, loyalty, cache)
│   ├── utils/            # Calculations, discounts, scraper, hashing
│   └── reprossitories/   # Data access layer (repos per domain)
├── frontend-react/       # React 18 + Vite frontend
│   ├── src/
│   │   ├── api/          # Axios API modules (one per domain)
│   │   ├── context/      # AuthContext, CartContext, WishlistContext
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route-level page components
│   │   ├── App.jsx       # Router + layout wrapper
│   │   ├── main.jsx      # React root mount
│   │   └── index.css     # Global styles + gold theme vars
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── frontend/             # Legacy HTML/CSS/JS (kept as reference)
├── uploads/              # Uploaded product/profile images
├── .env                  # Secret credentials (never commit)
└── requirements.txt      # Python deps
```

---

## Backend Setup

```bash
# 1. Create virtual environment
python -m venv .venv
.venv\Scripts\activate       # Windows
source .venv/bin/activate    # Linux/Mac

# 2. Install dependencies
pip install -r requirements.txt

# 3. Create .env (copy keys from .env.example)
cp .env.example .env

# 4. Create MySQL database
mysql -u root -p
CREATE DATABASE tayyab_jewellers_db;

# 5. Run migrations (SQLAlchemy auto-creates tables on startup)
# 6. Start server
uvicorn backend.main:app --reload --port 8000
```

---

## Frontend Setup (React)

```bash
cd frontend-react
npm install
npm run dev      # http://localhost:5173
npm run build    # Production build → dist/
```

---

## API Base URL

Development: `http://localhost:8000`  
The React app reads from `VITE_API_BASE_URL` in `frontend-react/.env`.

---

## API Endpoints Summary

### Authentication
| Method | Path | Description |
|--------|------|-------------|
| POST | `/users/login` | Login (form-encoded: username + password) |
| POST | `/users/register` | Register new user |
| GET | `/auth/me` | Get current user info |
| POST | `/auth/refresh` | Refresh JWT token |

### Products
| Method | Path | Description |
|--------|------|-------------|
| GET | `/products/` | List all products |
| POST | `/products/` | Create product (admin) |
| GET | `/products/search` | Search with filters |
| POST | `/products/upload-image/{id}` | Upload product image (admin) |

### Cart
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/cart/` | Get cart items |
| POST | `/api/cart/` | Add item to cart |
| PUT | `/api/cart/{item_id}` | Update quantity |
| DELETE | `/api/cart/{item_id}` | Remove item |

### Orders
| Method | Path | Description |
|--------|------|-------------|
| GET | `/orders/me` | Get user's orders |
| POST | `/orders/` | Place new order |
| PUT | `/orders/{order_id}/status` | Update status (admin) |

### Payments (Pakistan-focused)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/payments/` | Create payment |
| GET | `/payments/{id}` | Get payment |
| GET | `/payments/order/{order_id}` | Get order payments |
| POST | `/payments/verify-bank-transfer/{id}` | Verify bank transfer (admin) |

**Payment Methods:** `bank_transfer`, `jazz_cash`, `easypaisa`, `cash_on_delivery`, `stripe`, `paypal`

### Gold Rates
| Method | Path | Description |
|--------|------|-------------|
| GET | `/rates/latest` | Live gold rates (cached 60s) |
| POST | `/rates/manual` | Insert rate manually (admin) |

---

## Database Models

1. **User** — accounts, roles (admin/user)
2. **Product** — jewelry catalog (metal_type, karat, weight_grams, price, making_charge)
3. **Order** + **OrderItem** — orders and line items
4. **Payment** — payment records with method/status
5. **GoldRate** — current gold prices by karat
6. **GoldRateHistory** — historical rate data
7. **UserProfile** — extended user info
8. **UserAddress** — multiple addresses per user
9. **Cart** — shopping cart items
10. **Wishlist** — saved favourite products

---

## Authentication Flow

1. User calls `POST /users/login` with **form-encoded** `username=email&password=...`
2. Backend returns `{ access_token, token_type, refresh_token }`
3. Tokens stored in `localStorage` as `access_token` and `refresh_token`
4. All protected requests include `Authorization: Bearer <access_token>`
5. Axios interceptor automatically refreshes token on 401

---

## Payment Integration (Pakistan)

- **JazzCash** — mobile wallet; user provides phone number and transaction ID
- **EasyPaisa** — mobile wallet; same flow as JazzCash
- **Bank Transfer** — user transfers to business account, admin verifies manually
- **Cash on Delivery** — most common; order placed, payment on delivery
- **Stripe/PayPal** — international (future)

---

## Environment Variables (.env)

```
DATABASE_USER=root
DATABASE_PASSWORD=...
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=tayyab_jewellers_db

JWT_SECRET=...
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1400

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=...
SMTP_PASSWORD=...
SMTP_FROM=...

GOLD_SCRAPER_URL=...
TOLA_WEIGHT_GRAM=11.664
```

---

## Development Notes

- Login endpoint uses OAuth2 form encoding (NOT JSON body) — `Content-Type: application/x-www-form-urlencoded`
- Product images served from `/uploads/` via FastAPI StaticFiles
- Gold rates are scraped + cached with 60-second TTL; fallback to DB if scrape fails
- Admin routes require `is_admin=True` on the User model
- `require_admin()` dependency used in protected admin endpoints
- Cart is server-side (DB-backed), not localStorage-based
- CORS is enabled for localhost:5173 (React dev) and localhost:3000

---

## Key Packages

**Backend:**
```
fastapi, uvicorn, sqlalchemy, pymysql, pyjwt, bcrypt,
python-multipart, python-dotenv, requests, email-validator
```

**Frontend:**
```
react, react-dom, react-router-dom, axios, bootstrap,
react-toastify, react-hook-form, react-icons, @tanstack/react-query
```
