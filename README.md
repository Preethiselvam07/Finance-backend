# Finance Data Processing and Access Control Backend

## Tech Stack
Node.js, Express, MongoDB (Mongoose), JWT

## Setup Instructions
1. Clone the repo and run `npm install`
2. Create a `.env` file with:
   - `PORT=5000`
   - `MONGO_URI=your_mongodb_connection_string`
   - `JWT_SECRET=your_secret`
   - `JWT_EXPIRES_IN=7d`
3. Run `npm run dev`

## Roles and Permissions
| Action                  | Viewer | Analyst | Admin |
|-------------------------|--------|---------|-------|
| View records            | ✅     | ✅      | ✅    |
| View dashboard summary  | ❌     | ✅      | ✅    |
| Create/Edit/Delete      | ❌     | ❌      | ✅    |
| Manage users            | ❌     | ❌      | ✅    |

## Key API Endpoints

### Auth
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login and get token

### Users (Admin only)
- `GET /api/users`
- `PATCH /api/users/:id/role`
- `PATCH /api/users/:id/status`

### Records
- `POST /api/records` — Admin
- `GET /api/records?type=income&category=salary&page=1&limit=10` — All roles
- `PUT /api/records/:id` — Admin
- `DELETE /api/records/:id` — Admin (soft delete)

### Dashboard
- `GET /api/records/dashboard/summary` — Analyst + Admin

## Assumptions
- Soft delete is used instead of hard delete to preserve data history
- Roles are enforced at the middleware level for clean separation of concerns
- JWT tokens expire in 7 days
