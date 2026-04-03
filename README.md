# Finance Data Processing and Access Control Backend

## Interactive API Documentation
Visit `http://localhost:3000/api-docs` after starting the server to explore and test all APIs interactively via Swagger UI.

## Overview
A backend system for a finance dashboard where different users interact with financial records based on their roles. Built with Node.js, Express, and MongoDB.

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **API Docs:** Swagger UI

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB running locally

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Preethiselvam07/Finance-backend.git
   cd Finance-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root:
   ```
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/finance_db
   JWT_SECRET=finance_secret_key_zorvyn_2024
   JWT_EXPIRES_IN=7d
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

5. Server runs at: `http://localhost:3000`
6. Swagger docs at: `http://localhost:3000/api-docs`

---

## Project Structure
```
src/
├── config/
│   ├── db.js              → MongoDB connection
│   └── swagger.js         → Swagger configuration
├── models/
│   ├── User.js            → User schema with role and status
│   └── FinancialRecord.js → Financial record schema
├── middleware/
│   ├── auth.js            → JWT verification middleware
│   └── roleGuard.js       → Role-based access control
├── controllers/
│   ├── authController.js  → Register and login logic
│   ├── userController.js  → User management logic
│   └── recordController.js→ Financial records + dashboard
├── routes/
│   ├── authRoutes.js      → Auth endpoints
│   ├── userRoutes.js      → User management endpoints
│   └── recordRoutes.js    → Records + dashboard endpoints
└── app.js                 → Express app setup
```

---

## Roles and Permissions

| Action                  | Viewer | Analyst | Admin |
|-------------------------|--------|---------|-------|
| View records            | ✅     | ✅      | ✅    |
| View dashboard summary  | ❌     | ✅      | ✅    |
| Create records          | ❌     | ❌      | ✅    |
| Update records          | ❌     | ❌      | ✅    |
| Delete records          | ❌     | ❌      | ✅    |
| Manage users            | ❌     | ❌      | ✅    |

---

## API Documentation

### Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_token>
```

---

### Auth Endpoints

#### Register User
```
POST /api/auth/register
```
**Body:**
```json
{
  "name": "Preethi Admin",
  "email": "admin@finance.com",
  "password": "admin123",
  "role": "admin"
}
```
**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJ...",
  "user": {
    "id": "64abc...",
    "name": "Preethi Admin",
    "email": "admin@finance.com",
    "role": "admin"
  }
}
```

#### Login
```
POST /api/auth/login
```
**Body:**
```json
{
  "email": "admin@finance.com",
  "password": "admin123"
}
```
**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJ...",
  "user": {
    "id": "64abc...",
    "name": "Preethi Admin",
    "email": "admin@finance.com",
    "role": "admin"
  }
}
```

---

### User Endpoints (Admin only)

#### Get All Users
```
GET /api/users
Authorization: Bearer <admin_token>
```

#### Update User Role
```
PATCH /api/users/:id/role
Authorization: Bearer <admin_token>
```
**Body:**
```json
{ "role": "analyst" }
```

#### Update User Status
```
PATCH /api/users/:id/status
Authorization: Bearer <admin_token>
```
**Body:**
```json
{ "isActive": false }
```

---

### Financial Record Endpoints

#### Create Record (Admin only)
```
POST /api/records
Authorization: Bearer <admin_token>
```
**Body:**
```json
{
  "amount": 5000,
  "type": "income",
  "category": "Salary",
  "date": "2026-04-01",
  "notes": "Monthly salary"
}
```
**Validation Rules:**
- amount: required, must be greater than 0
- type: required, must be income or expense
- category: required
- date: required

#### Get All Records (All roles)
```
GET /api/records
Authorization: Bearer <token>
```
**Query Parameters:**

| Parameter | Description | Example |
|-----------|-------------|---------|
| type | Filter by type | ?type=income |
| category | Filter by category | ?category=Salary |
| startDate | Filter from date | ?startDate=2026-01-01 |
| endDate | Filter to date | ?endDate=2026-12-31 |
| search | Search in notes | ?search=salary |
| page | Page number | ?page=1 |
| limit | Records per page | ?limit=10 |

#### Get Single Record (All roles)
```
GET /api/records/:id
Authorization: Bearer <token>
```

#### Update Record (Admin only)
```
PUT /api/records/:id
Authorization: Bearer <admin_token>
```
**Body:**
```json
{
  "amount": 6000,
  "notes": "Updated salary"
}
```

#### Delete Record - Soft Delete (Admin only)
```
DELETE /api/records/:id
Authorization: Bearer <admin_token>
```
**Response:**
```json
{ "message": "Record soft-deleted successfully." }
```

---

### Dashboard Endpoints (Admin + Analyst only)

#### Get Dashboard Summary
```
GET /api/records/dashboard/summary
Authorization: Bearer <admin_or_analyst_token>
```
**Response:**
```json
{
  "summary": {
    "totalIncome": 5000,
    "totalExpenses": 1500,
    "netBalance": 3500
  },
  "categoryBreakdown": [
    {
      "_id": { "category": "Salary", "type": "income" },
      "total": 5000
    }
  ],
  "recentTransactions": []
}
```

---

## Error Responses

| Status Code | Meaning |
|-------------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request or Validation error |
| 401 | Unauthorized or Invalid token |
| 403 | Forbidden or Insufficient role |
| 404 | Not found |
| 500 | Server error |

**Validation error example:**
```json
{
  "message": "Validation failed",
  "errors": {
    "amount": "Amount is required",
    "type": "Type is required"
  }
}
```

**Access denied example:**
```json
{
  "message": "Access denied. Required role: admin or analyst"
}
```

---

## Design Decisions

1. **Soft Delete** — Records are never permanently deleted. An `isDeleted` flag is used instead. This preserves financial data history which is critical in finance systems.

2. **Role Middleware** — Access control is enforced at the middleware level using `roleGuard`, keeping controllers clean and maintaining separation of concerns.

3. **JWT Authentication** — Stateless authentication using JWT tokens that expire in 7 days. No session storage needed.

4. **Password Security** — Passwords are hashed using bcryptjs with 10 salt rounds before storing. Never returned in API responses.

5. **Pagination** — All list endpoints support pagination via `page` and `limit` query params to prevent large data dumps.

6. **MongoDB Aggregation** — Dashboard summary uses MongoDB aggregation pipeline for efficient server-side data processing rather than fetching all records to the application layer.

7. **Swagger Documentation** — Interactive API documentation available at `/api-docs` for easy testing and exploration of all endpoints.

---

## Assumptions Made

- All monetary amounts are stored as numbers (INR assumed)
- A user role is assigned at registration and can be changed by admin
- Soft deleted records are excluded from all queries and dashboard calculations
- Date filtering is inclusive on both start and end dates
- JWT tokens expire after 7 days for security

## Tradeoffs Considered

- Used MongoDB over relational DB for flexibility in financial record schema
- Chose soft delete over hard delete to maintain audit trail
- Mock authentication used (no email verification) to keep scope manageable
- Stateless JWT used over sessions for simplicity and scalability
