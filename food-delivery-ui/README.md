<<<<<<< HEAD
# Developer Assignment Pack

This repository contains two independent projects:
1. `crm-backend/` — Node.js + Express + MongoDB REST API with JWT authentication and atomic lead claiming.
2. `food-delivery-ui/` — React + Vite mobile-first UI inspired by the supplied Figma screenshot (signup, OTP, home, product detail).

## Requirements
- Node.js 18+
- MongoDB local instance or MongoDB Atlas connection string
- npm

## 1) Run the CRM backend
```bash
cd crm-backend
cp .env.example .env
# Set MONGODB_URI and JWT_SECRET in .env
npm install
npm run dev
```
Default API base URL: `http://localhost:5000/api`

### API quick test
Register a counselor:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Demo Counselor","email":"counselor@example.com","password":"StrongPass123"}'
```
Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"counselor@example.com","password":"StrongPass123"}'
```
Copy `token` from the response and use `Authorization: Bearer YOUR_TOKEN`.

Create a public enquiry (no token):
```bash
curl -X POST http://localhost:5000/api/enquiries \
  -H "Content-Type: application/json" \
  -d '{"name":"Asha Sharma","email":"asha@example.com","phone":"9876543210","courseInterest":"Full Stack Development","message":"Please contact me"}'
```
Fetch public leads:
```bash
curl http://localhost:5000/api/enquiries/public \
  -H "Authorization: Bearer YOUR_TOKEN"
```
Claim one:
```bash
curl -X PATCH http://localhost:5000/api/enquiries/ENQUIRY_ID/claim \
  -H "Authorization: Bearer YOUR_TOKEN"
```
Fetch your leads:
```bash
curl http://localhost:5000/api/enquiries/my-leads \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### API routes
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create counselor account |
| POST | `/api/auth/login` | No | Login and return JWT |
| GET | `/api/auth/me` | Yes | Current counselor |
| POST | `/api/enquiries` | No | Submit public enquiry |
| GET | `/api/enquiries/public` | Yes | List unclaimed enquiries |
| PATCH | `/api/enquiries/:id/claim` | Yes | Atomically claim a lead |
| GET | `/api/enquiries/my-leads` | Yes | List current counselor's leads |

### Design notes
- Passwords are hashed using bcryptjs.
- JWT is verified by middleware.
- The claim route uses one conditional MongoDB `findOneAndUpdate` query. Concurrent claims cannot both win.
- Email is normalized and unique for counselor accounts.
- Public enquiry submission is intentionally unauthenticated.
- In production, add rate limiting, email verification, logging, pagination, CORS allowlists, HTTPS, and a retention/privacy policy.

## 2) Run the React UI
```bash
cd food-delivery-ui
npm install
npm run dev
```
Open the URL Vite prints (normally `http://localhost:5173`).

The UI is a front-end prototype. OTP verification and cart actions are demo interactions; no SMS provider or backend is connected.
=======
# Developer Assignment Pack

This repository contains two independent projects:
1. `crm-backend/` — Node.js + Express + MongoDB REST API with JWT authentication and atomic lead claiming.
2. `food-delivery-ui/` — React + Vite mobile-first UI inspired by the supplied Figma screenshot (signup, OTP, home, product detail).

## Requirements
- Node.js 18+
- MongoDB local instance or MongoDB Atlas connection string
- npm

## 1) Run the CRM backend
```bash
cd crm-backend
cp .env.example .env
# Set MONGODB_URI and JWT_SECRET in .env
npm install
npm run dev
```
Default API base URL: `http://localhost:5000/api`

### API quick test
Register a counselor:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Demo Counselor","email":"counselor@example.com","password":"StrongPass123"}'
```
Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"counselor@example.com","password":"StrongPass123"}'
```
Copy `token` from the response and use `Authorization: Bearer YOUR_TOKEN`.

Create a public enquiry (no token):
```bash
curl -X POST http://localhost:5000/api/enquiries \
  -H "Content-Type: application/json" \
  -d '{"name":"Asha Sharma","email":"asha@example.com","phone":"9876543210","courseInterest":"Full Stack Development","message":"Please contact me"}'
```
Fetch public leads:
```bash
curl http://localhost:5000/api/enquiries/public \
  -H "Authorization: Bearer YOUR_TOKEN"
```
Claim one:
```bash
curl -X PATCH http://localhost:5000/api/enquiries/ENQUIRY_ID/claim \
  -H "Authorization: Bearer YOUR_TOKEN"
```
Fetch your leads:
```bash
curl http://localhost:5000/api/enquiries/my-leads \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### API routes
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create counselor account |
| POST | `/api/auth/login` | No | Login and return JWT |
| GET | `/api/auth/me` | Yes | Current counselor |
| POST | `/api/enquiries` | No | Submit public enquiry |
| GET | `/api/enquiries/public` | Yes | List unclaimed enquiries |
| PATCH | `/api/enquiries/:id/claim` | Yes | Atomically claim a lead |
| GET | `/api/enquiries/my-leads` | Yes | List current counselor's leads |

### Design notes
- Passwords are hashed using bcryptjs.
- JWT is verified by middleware.
- The claim route uses one conditional MongoDB `findOneAndUpdate` query. Concurrent claims cannot both win.
- Email is normalized and unique for counselor accounts.
- Public enquiry submission is intentionally unauthenticated.
- In production, add rate limiting, email verification, logging, pagination, CORS allowlists, HTTPS, and a retention/privacy policy.

## 2) Run the React UI
```bash
cd food-delivery-ui
npm install
npm run dev
```
Open the URL Vite prints (normally `http://localhost:5173`).

The UI is a front-end prototype. OTP verification and cart actions are demo interactions; no SMS provider or backend is connected.
>>>>>>> 0ea5d4614159ff0c1e7739900dbf9527c3870480
