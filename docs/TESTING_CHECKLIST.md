# Testing Checklist

Use this checklist before final demonstration. Run the server and client, seed demo data, then verify each item.

## Setup

- [ ] MongoDB is running and `MONGODB_URI` is set in `server/.env`
- [ ] `JWT_SECRET` is set in `server/.env`
- [ ] `npm run seed` in `server/` completes without errors
- [ ] Server starts: `npm run dev` in `server/` → `GET /api/health` returns OK
- [ ] Client starts: `npm run dev` in `client/` → login page loads at `http://localhost:5173`

## Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | Admin@12345 |
| Officer | officer@example.com | Officer@12345 |
| Owner | owner@example.com | Owner@12345 |

## Authentication

- [ ] Login with valid credentials redirects to the correct role dashboard
- [ ] Login with invalid credentials shows an error message
- [ ] Protected routes redirect unauthenticated users to `/login`
- [ ] Admin cannot access `/officer` or `/owner` routes (and vice versa)
- [ ] Logout clears the session and returns to login

## Admin workflow

- [ ] Admin dashboard shows summary cards (properties, billed, collected, outstanding)
- [ ] Users page: list, create, update, and deactivate users
- [ ] Owners page: view owner list with search
- [ ] Properties page: view property list with zone/type filters
- [ ] Tax rates page: create, edit, and delete tax rates
- [ ] Bills page: view all bills with status filters
- [ ] Payments page: view payment history
- [ ] Reports page: summary, collections, outstanding, and by-zone tabs load with filters
- [ ] Audit logs page: list entries with action/entity/search filters

## Officer workflow

- [ ] Officer dashboard shows operational summary
- [ ] Register a new owner with required fields validated
- [ ] Register a new property linked to an owner
- [ ] Generate an assessment for a property (tax year 2026)
- [ ] Create a bill from an assessment with a due date
- [ ] Record a full payment on an unpaid bill → bill status becomes `paid`, balance = 0
- [ ] Record a partial payment → bill status becomes `partial`, balance reduced
- [ ] Download receipt PDF from receipts page
- [ ] Reports page returns filtered data for officer role

## Owner workflow

- [ ] Owner login redirects to owner portal
- [ ] My Properties shows only Ahmed Hassan properties (2 seeded properties)
- [ ] My Bills shows bills for owned properties only (not other owners)
- [ ] My Payments shows payment history for owned bills only
- [ ] Receipts page lists receipts and PDF download works
- [ ] Owner cannot access admin or officer URLs

## Seeded demo data (after `npm run seed`)

- [ ] 3 owners exist (Ahmed Hassan linked to owner@example.com)
- [ ] 5 properties across Zone A, B, and C
- [ ] 4 tax rates for 2026
- [ ] 5 bills with mixed statuses: paid, partial, unpaid, overdue
- [ ] 2 payments with receipts (PAY-SEED-001, PAY-SEED-002)
- [ ] Audit log contains SEED entries

## Tax calculation

- [ ] Percentage rate: `assessedValue × rateValue / 100` (e.g. Zone A Residential → 750)
- [ ] Fixed rate: annual tax = `rateValue` (e.g. Zone B Residential → 500)
- [ ] Bill balance = amountDue − amountPaid
- [ ] Status rules: paid / partial / unpaid / overdue applied correctly

## API (optional — use Postman or curl)

- [ ] `POST /api/auth/login` returns JWT token
- [ ] `GET /api/auth/me` with Bearer token returns user profile
- [ ] `GET /api/reports/summary` returns totals for admin/officer
- [ ] `GET /api/audit-logs` returns entries for admin only (403 for officer/owner)
- [ ] `GET /api/bills/:id/pdf` downloads bill PDF
- [ ] `GET /api/receipts/:id/pdf` downloads receipt PDF

## UI quality

- [ ] Sidebar navigation works on all role layouts
- [ ] Tables support search and filter controls
- [ ] Forms show validation errors for invalid input
- [ ] Loading and error states display correctly
- [ ] Layout is usable on mobile viewport width

## Documentation

- [ ] README explains server and client setup
- [ ] `server/.env.example` and `client/.env.example` exist
- [ ] `docs/API_ENDPOINTS.md` matches implemented routes
- [ ] Demo screenshots added to `docs/screenshots/` (see SCREENSHOTS.md)
