# API Endpoints

Base URL: `/api`

All protected routes require: `Authorization: Bearer <token>`

## Auth

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/login` | Public | Login with email and password |
| GET | `/auth/me` | Authenticated | Get current user profile |

## Users (Admin only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | List users (`?role`, `?status`, `?search`) |
| POST | `/users` | Create user |
| PATCH | `/users/:id` | Update user |
| DELETE | `/users/:id` | Deactivate user (soft) |

**Create user body:**
```json
{
  "name": "Jane Officer",
  "email": "jane@example.com",
  "password": "SecurePass1",
  "role": "officer",
  "status": "active"
}
```

## Owners (Admin, Officer)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/owners` | List owners (`?search`) |
| POST | `/owners` | Register owner |
| GET | `/owners/:id` | Get owner by ID |
| PATCH | `/owners/:id` | Update owner |

**Create owner body:**
```json
{
  "fullName": "Ahmed Hassan",
  "phone": "+252612345678",
  "email": "ahmed@example.com",
  "nationalId": "ID-001",
  "address": "Hodan District, Mogadishu",
  "userId": null
}
```

## Properties

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/properties` | Admin, Officer | List properties (`?search`, `?zone`, `?propertyType`, `?status`) |
| POST | `/properties` | Admin, Officer | Register property |
| GET | `/properties/:id` | Admin, Officer | Get property by ID |
| PATCH | `/properties/:id` | Admin, Officer | Update property |
| GET | `/owner/properties` | Owner | List own properties |

**Create property body:**
```json
{
  "ownerId": "<ownerObjectId>",
  "district": "Hodan",
  "zone": "Zone A",
  "propertyType": "Residential",
  "sizeSqm": 120,
  "assessedValue": 50000,
  "usageStatus": "occupied"
}
```

## Tax Rates

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/tax-rates` | Admin, Officer | List rates (`?zone`, `?propertyType`, `?taxYear`) |
| POST | `/tax-rates` | Admin | Create tax rate |
| PATCH | `/tax-rates/:id` | Admin | Update tax rate |
| DELETE | `/tax-rates/:id` | Admin | Delete tax rate |

**Create tax rate body:**
```json
{
  "zone": "Zone A",
  "propertyType": "Residential",
  "taxYear": 2026,
  "rateType": "percentage",
  "rateValue": 1.5
}
```

## Assessments (Admin, Officer)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/assessments/generate` | Generate assessment from tax rate |
| GET | `/assessments` | List assessments (`?taxYear`, `?propertyId`) |
| GET | `/assessments/:id` | Get assessment by ID |

**Generate assessment body:**
```json
{
  "propertyId": "<propertyObjectId>",
  "taxYear": 2026,
  "penalty": 0,
  "discount": 0
}
```

**Tax calculation:**
- `fixed` → baseTax = rateValue
- `percentage` → baseTax = assessedValue × rateValue / 100
- totalDue = baseTax + penalty − discount

## Bills

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/bills` | Admin, Officer | Create bill from assessment |
| GET | `/bills` | Admin, Officer | List bills (`?status`, `?year`, `?zone`, `?from`, `?to`) |
| GET | `/bills/:id` | Admin, Officer | Get bill by ID |
| GET | `/bills/:id/pdf` | Admin, Officer, Owner* | Download bill PDF |
| GET | `/owner/bills` | Owner | List own bills (`?status`) |

**Create bill body:**
```json
{
  "assessmentId": "<assessmentObjectId>",
  "dueDate": "2026-12-31"
}
```

**Bill status rules:**
- `paid` — balance ≤ 0
- `partial` — amountPaid > 0 and balance > 0 (before due date)
- `unpaid` — amountPaid = 0 and due date not passed
- `overdue` — due date passed and balance > 0

## Payments

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/payments` | Admin, Officer | Record payment (creates receipt) |
| GET | `/payments` | Admin, Officer | List payments (`?method`, `?from`, `?to`) |
| GET | `/owner/payments` | Owner | List own payments |

**Record payment body:**
```json
{
  "billId": "<billObjectId>",
  "amountPaid": 500,
  "method": "cash",
  "referenceNo": "REF-001",
  "paymentDate": "2026-06-01"
}
```

## Receipts

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/receipts/:id/pdf` | Admin, Officer, Owner* | Download receipt PDF |
| GET | `/receipts/verify/:token` | Public | Verify receipt by QR token |

\* Owner access only for their own bills/receipts.

## Reports (Admin, Officer)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reports/summary` | Summary totals (`?taxYear`, `?zone`, `?propertyType`, `?status`, `?from`, `?to`) |
| GET | `/reports/collections` | Payment collections (`?taxYear`, `?zone`, `?propertyType`, `?method`, `?from`, `?to`) |
| GET | `/reports/outstanding` | Outstanding bills (`?taxYear`, `?zone`, `?propertyType`, `?status`) |
| GET | `/reports/by-zone` | Zone breakdown (`?taxYear`) |

## Audit Logs (Admin only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/audit-logs` | List audit entries (`?action`, `?entityType`, `?search`, `?from`, `?to`) |

## Health

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/health` | Public | API health check |
