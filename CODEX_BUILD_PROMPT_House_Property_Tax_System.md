# Codex Build Prompt: House Property Tax Management System

You are building a final year project called **Design and Implementation of a Web-Based House Property Tax Management System**.

Build a complete full-stack web application that demonstrates the full property tax workflow:

1. Admin logs in and manages users, zones, property types, and tax rates.
2. Tax Officer registers owners and properties.
3. System calculates annual property tax based on zone, property type, tax year, and rate.
4. Tax Officer generates bills with due dates.
5. Tax Officer records full or partial payments.
6. System updates outstanding balances.
7. System generates downloadable PDF receipts.
8. Property Owner logs in and views own properties, bills, payments, notices, and receipts.
9. Admin views reports by period, zone, tax year, property type, and payment status.
10. Audit logs record important actions.

## Tech Stack

Use this stack unless a package is unavailable:

- Frontend: React.js with Vite
- Styling: Tailwind CSS and shadcn/ui-style components
- Routing: React Router v6
- State/API: Redux Toolkit with RTK Query, or a simple API service if faster
- Backend: Node.js and Express.js
- Database: MongoDB Atlas with Mongoose
- Auth: JWT and bcrypt
- PDF: PDFKit
- Validation: Zod or express-validator
- API Testing: Postman collection or documented endpoint list
- Deployment target: Vercel frontend, Render backend, MongoDB Atlas database

## Required User Roles

### Admin
- Login/logout
- Manage users
- Manage zones and property types
- Manage tax rates
- View all owners, properties, bills, payments, reports, and audit logs

### Tax Officer
- Login/logout
- Register owners
- Register and update properties
- Generate assessments and bills
- Record payments
- Generate receipts
- View operational reports

### Property Owner
- Login/logout
- View own profile
- View own properties
- View bills and outstanding balances
- View payment history
- Download receipts

## Recommended Repository Structure

```txt
house-property-tax-system/
  client/
    src/
      app/
      components/
      features/
        auth/
        dashboard/
        users/
        owners/
        properties/
        taxRates/
        assessments/
        bills/
        payments/
        reports/
      layouts/
      routes/
      services/
      utils/
  server/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      services/
      validators/
      utils/
      seeds/
      app.js
      server.js
  docs/
    API_ENDPOINTS.md
    TESTING_CHECKLIST.md
    SCREENSHOTS.md
  README.md
```

## Backend Models

Create Mongoose models with timestamps and validation.

### User
Fields:
- name
- email, unique
- passwordHash
- role: admin, officer, owner
- status: active, inactive

### Owner
Fields:
- userId optional ref User
- fullName
- phone
- email optional
- nationalId optional unique sparse
- address

### Property
Fields:
- ownerId ref Owner
- propertyCode unique
- district
- zone
- propertyType
- sizeSqm optional
- assessedValue number
- usageStatus: occupied, vacant, rented
- status: active, inactive

### TaxRate
Fields:
- zone
- propertyType
- taxYear
- rateType: fixed, percentage
- rateValue
- createdBy ref User
Unique compound index: zone + propertyType + taxYear.

### Assessment
Fields:
- propertyId ref Property
- taxYear
- baseTax
- penalty default 0
- discount default 0
- totalDue
- assessedBy ref User
Unique compound index: propertyId + taxYear.

### Bill
Fields:
- assessmentId ref Assessment
- billNo unique
- dueDate
- amountDue
- amountPaid default 0
- balance
- status: unpaid, partial, paid, overdue, cancelled
- issuedBy ref User

### Payment
Fields:
- billId ref Bill
- amountPaid
- method: cash, bank, mobile_money, other
- referenceNo unique sparse
- paymentDate
- recordedBy ref User

### Receipt
Fields:
- paymentId ref Payment
- receiptNo unique
- pdfPath optional
- qrToken optional

### AuditLog
Fields:
- actorId ref User
- action
- entityType
- entityId
- description
- ipAddress optional

## Backend API Endpoints

Use `/api` prefix.

### Auth
- POST `/api/auth/login`
- GET `/api/auth/me`
- POST `/api/auth/logout` optional client-side only

### Users
- GET `/api/users` admin only
- POST `/api/users` admin only
- PATCH `/api/users/:id` admin only
- DELETE `/api/users/:id` admin only or soft deactivate

### Owners
- GET `/api/owners` admin/officer
- POST `/api/owners` admin/officer
- GET `/api/owners/:id` admin/officer
- PATCH `/api/owners/:id` admin/officer

### Properties
- GET `/api/properties` admin/officer, supports search, zone, type, status
- POST `/api/properties` admin/officer
- GET `/api/properties/:id` admin/officer
- PATCH `/api/properties/:id` admin/officer
- GET `/api/owner/properties` owner only

### Tax Rates
- GET `/api/tax-rates` admin/officer
- POST `/api/tax-rates` admin only
- PATCH `/api/tax-rates/:id` admin only
- DELETE `/api/tax-rates/:id` admin only

### Assessments
- POST `/api/assessments/generate` admin/officer
- GET `/api/assessments` admin/officer
- GET `/api/assessments/:id` admin/officer

### Bills
- POST `/api/bills` admin/officer
- GET `/api/bills` admin/officer, supports status, year, zone, date range
- GET `/api/bills/:id` admin/officer
- GET `/api/owner/bills` owner only
- GET `/api/bills/:id/pdf` admin/officer/owner if owner owns it

### Payments
- POST `/api/payments` admin/officer
- GET `/api/payments` admin/officer
- GET `/api/owner/payments` owner only

### Receipts
- GET `/api/receipts/:id/pdf` admin/officer/owner if owner owns it
- GET `/api/receipts/verify/:token` public optional

### Reports
- GET `/api/reports/summary` admin/officer
- GET `/api/reports/collections` admin/officer
- GET `/api/reports/outstanding` admin/officer
- GET `/api/reports/by-zone` admin/officer

### Audit Logs
- GET `/api/audit-logs` admin only

## Tax Calculation Rules

Implement a simple but clear rule:

- If `rateType` is `fixed`, annual tax = `rateValue`.
- If `rateType` is `percentage`, annual tax = `assessedValue * rateValue / 100`.
- totalDue = baseTax + penalty - discount.
- Bill balance = amountDue - amountPaid.
- Bill status:
  - paid if balance <= 0
  - partial if amountPaid > 0 and balance > 0
  - unpaid if amountPaid == 0 and due date is not passed
  - overdue if due date passed and balance > 0

## Frontend Pages

### Public
- Login page
- Optional receipt verification page

### Admin Dashboard
- Summary cards: total properties, total billed, total collected, outstanding amount
- Users management
- Owners list
- Properties list
- Tax rates
- Bills
- Payments
- Reports
- Audit logs

### Officer Dashboard
- Summary cards
- Owners
- Properties
- Assessments
- Bills
- Payments
- Receipts
- Reports

### Owner Dashboard
- My properties
- My bills
- My payments
- My receipts
- Pending notices

## UI Requirements

- Use clean responsive layout.
- Sidebar navigation for logged-in users.
- Table pages must include search and filter controls.
- Forms must show validation messages.
- Use confirmation before delete/deactivate actions.
- Show loading and error states.
- Use simple dashboard cards and charts if time allows.

## Seed Data

Create a seed script that inserts:

- Admin account: admin@example.com / Admin@12345
- Officer account: officer@example.com / Officer@12345
- Owner account: owner@example.com / Owner@12345
- 3 sample owners
- 5 sample properties across different zones and property types
- 4 tax rates
- At least 3 bills
- At least 2 payments and receipts

## Acceptance Criteria

The project is considered ready for final demonstration when all of these work:

- Admin can login.
- Admin can create an officer and owner account.
- Officer can register an owner and property.
- Admin can create a tax rate.
- Officer can generate an assessment and bill.
- Officer can record a payment.
- System updates the bill balance correctly.
- Receipt PDF can be downloaded.
- Owner can login and view own bills, payments, and receipts only.
- Admin can view reports.
- Audit logs record major actions.
- README explains how to run client and server.
- `.env.example` files are provided for client and server.

## Development Order

1. Create repo structure.
2. Build backend setup: Express, MongoDB connection, error handling, environment variables.
3. Build auth: User model, seed admin, login, JWT middleware, role middleware.
4. Build models and CRUD APIs.
5. Build tax assessment, bill generation, payment recording, and receipt PDF logic.
6. Build frontend login and role-based layouts.
7. Build admin, officer, and owner pages.
8. Add reports, search, filters, and audit logs.
9. Add seed script and demo data.
10. Test full workflow.
11. Write README, API docs, and testing checklist.

## Important Notes

- Keep the project realistic for a final year project.
- Do not add real bank integration in the first version.
- Do not overcomplicate with GIS or SMS unless all core features are finished.
- Make the demo workflow strong and easy to explain.
- Use clear comments only where needed.
- Keep variable and folder names professional.
