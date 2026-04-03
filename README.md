# 💰 Finance Data Processing and Access Control Backend

## 🚀 Live Demo

🔗 API Base URL:  
https://finance-backend-1-rbq0.onrender.com  

📘 Swagger API Docs:  
https://finance-backend-1-rbq0.onrender.com/api-docs  

---

## 📄 Interactive API Documentation

Use Swagger UI to explore and test APIs:

- Local: http://localhost:3000/api-docs  
- Live: https://finance-backend-1-rbq0.onrender.com/api-docs  

---

## 📌 Overview

A backend system for a finance dashboard where different users interact with financial records based on their roles. Built with Node.js, Express, and MongoDB.

---

## ✨ Features

- User Registration & Login  
- JWT Authentication  
- Role-Based Access Control (Admin, Analyst, Viewer)  
- CRUD operations for financial records  
- Dashboard analytics using MongoDB aggregation  
- Secure API endpoints with middleware  
- Interactive API documentation using Swagger  

---

## ⚙️ Tech Stack

- **Runtime:** Node.js  
- **Framework:** Express.js  
- **Database:** MongoDB Atlas with Mongoose ODM  
- **Authentication:** JWT (JSON Web Tokens)  
- **Password Hashing:** bcryptjs  
- **API Docs:** Swagger UI  
- **Deployment:** Render  

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js installed  
- MongoDB running locally or MongoDB Atlas  

---

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
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=finance_secret_key_zorvyn_2024
JWT_EXPIRES_IN=7d
```

4. Start the server:
```bash
npm run dev
```

5. Server runs locally at:  
http://localhost:3000  

6. Swagger docs locally at:  
http://localhost:3000/api-docs  

🌐 Live Deployment:  
https://finance-backend-1-rbq0.onrender.com  

---

## 📂 Project Structure

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

## 👥 Roles and Permissions

| Action                  | Viewer | Analyst | Admin |
|------------------------|--------|---------|-------|
| View records           | ✅     | ✅      | ✅    |
| View dashboard summary | ❌     | ✅      | ✅    |
| Create records         | ❌     | ❌      | ✅    |
| Update records         | ❌     | ❌      | ✅    |
| Delete records         | ❌     | ❌      | ✅    |
| Manage users           | ❌     | ❌      | ✅    |

---

## 🔐 Authentication

All protected routes require a Bearer token:

```
Authorization: Bearer <your_token>
```

---

## 📂 API Endpoints

### 🔑 Auth

POST /api/auth/register

```json
{
  "name": "Preethi Admin",
  "email": "admin@finance.com",
  "password": "admin123",
  "role": "admin"
}
```

POST /api/auth/login

```json
{
  "email": "admin@finance.com",
  "password": "admin123"
}
```

---

### 👤 Users (Admin only)

- GET /api/users  
- PATCH /api/users/:id/role  
- PATCH /api/users/:id/status  

---

### 💰 Financial Records

- POST /api/records  
- GET /api/records  
- GET /api/records/:id  
- PUT /api/records/:id  
- DELETE /api/records/:id  

---

### 📊 Dashboard

- GET /api/records/dashboard/summary  

---

## ❌ Error Responses

| Status Code | Meaning |
|------------|--------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---

## 🧠 Design Decisions

- Soft delete using `isDeleted` flag to preserve financial history  
- Role-based middleware for clean access control  
- JWT authentication for scalability  
- Password hashing using bcrypt  
- Pagination for large datasets  
- MongoDB aggregation for dashboard analytics  
- Swagger for API documentation  

---

## 📌 Assumptions

- Monetary values stored as numbers (INR assumed)  
- Roles assigned at registration  
- Soft deleted records excluded from queries  
- Date filters are inclusive  
- JWT expires in 7 days  

---

## ⚖️ Tradeoffs

- MongoDB chosen for flexibility  
- Soft delete preferred over hard delete  
- No email verification (kept scope simple)  
- JWT used instead of sessions  

---

## 👩‍💻 Author

**Preethi Selvam**

GitHub: https://github.com/Preethiselvam07