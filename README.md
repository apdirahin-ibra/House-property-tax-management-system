# House Property Tax Management System

Web-based system for managing house property tax: user roles (Admin, Tax Officer, Property Owner), property registration, tax assessment, billing, payments, receipts, and reports.

## Project structure

```txt
house-property-tax-system/
  client/          # React + Vite frontend (Phase 5+)
  server/          # Node.js + Express API
  docs/            # API docs, testing checklist, screenshots
```

## Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

## Server setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

API base URL: `http://localhost:5000/api`

Health check: `GET http://localhost:5000/api/health`

### Seed demo data

```bash
npm run seed
```

Creates demo users plus sample owners, properties, tax rates, bills, payments, receipts, and audit log entries. Safe to re-run — existing users and demo data are skipped if already present.

| Email | Password | Role |
|-------|----------|------|
| admin@gmail.com | Admin@12345 | admin |
| officer@gmail.com | Officer@12345 | officer |
| owner@gmail.com | Owner@12345 | owner |

**Seeded demo data:** 3 owners, 5 properties (Zones A/B/C), 4 tax rates, 5 bills (paid/partial/unpaid/overdue), 2 payments with receipts. The owner account is linked to **Ahmed Hassan** for the owner portal demo.

### Auth endpoints

- `POST /api/auth/login` — body: `{ "email", "password" }`
- `GET /api/auth/me` — header: `Authorization: Bearer <token>`

## Client setup

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Frontend URL: `http://localhost:5173`

The dev server proxies `/api` requests to `http://localhost:5000`.

### Demo login

Use the same seed accounts as the server (run `npm run seed` in `server/` first):

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@gmail.com | Admin@12345 |
| Officer | officer@gmail.com | Officer@12345 |
| Owner | owner@gmail.com | Owner@12345 |

After login, users are redirected to their role dashboard (`/admin`, `/officer`, or `/owner`).

## Production deployment

The project is deployment-ready as a single Node service:

- The root build script installs the server and client dependencies.
- The React app is built into `client/dist`.
- In production, Express serves the React app and keeps all API routes under `/api`.

### Deploy on Render

1. Push this repository to GitHub.
2. Create a MongoDB Atlas database and copy its connection string.
3. In Render, create a new Blueprint/Web Service from this repo.
4. Use these settings if configuring manually:

| Setting | Value |
|---------|-------|
| Root directory | repository root |
| Build command | `npm run build` |
| Start command | `npm start` |
| Node version | `20` |

5. Add these environment variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | your MongoDB Atlas connection string |
| `JWT_SECRET` | a long random secret |
| `JWT_EXPIRES_IN` | `7d` |

6. After the first deploy, run the seed command from Render Shell if you want demo data:

```bash
npm run seed
```

The deployed URL will serve the landing page, login, dashboards, PDFs, and all API routes from the same domain.

## Development phases

| Phase | Scope |
|-------|--------|
| 1 | Repo structure + backend foundation |
| 2 | Auth (JWT, roles, seed admin) |
| 3 | Models + CRUD APIs |
| 4 | Tax workflow (assessments, bills, payments, PDF) |
| **5** | Frontend scaffold (Vite, login, layouts) | Done |
| **6** | Admin, Officer, Owner dashboards | Done |
| **7** | Reports, audit logs, filters | Done |
| **8** | Seed data, docs, full testing | Done |

## License

Academic / final year project.
