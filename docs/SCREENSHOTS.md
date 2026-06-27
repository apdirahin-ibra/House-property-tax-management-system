# Screenshots Guide

Add demo screenshots to `docs/screenshots/` for your final year project report and viva presentation.

## How to capture

1. Run `npm run seed` in `server/`, then start server and client.
2. Log in with each demo account (see README).
3. Capture screenshots at 1280×720 or full browser width.
4. Save files using the naming convention below.

## Required screenshots

| # | File name | Page | Account | What to show |
|---|-----------|------|---------|--------------|
| 1 | `01-login.png` | Login | — | Login form with project title |
| 2 | `02-admin-dashboard.png` | Admin dashboard | admin@example.com | Summary cards with totals |
| 3 | `03-admin-users.png` | Users | admin@example.com | User list with create form |
| 4 | `04-admin-tax-rates.png` | Tax rates | admin@example.com | Tax rate table |
| 5 | `05-admin-reports.png` | Reports | admin@example.com | Summary tab with filters |
| 6 | `06-admin-audit-logs.png` | Audit logs | admin@example.com | Audit log list |
| 7 | `07-officer-dashboard.png` | Officer dashboard | officer@example.com | Officer summary cards |
| 8 | `08-officer-assessments.png` | Assessments | officer@example.com | Assessment generation |
| 9 | `09-officer-payments.png` | Payments | officer@example.com | Payment recording |
| 10 | `10-officer-receipts.png` | Receipts | officer@example.com | Receipt list |
| 11 | `11-owner-properties.png` | My properties | owner@example.com | Ahmed Hassan properties |
| 12 | `12-owner-bills.png` | My bills | owner@example.com | Bills with paid/partial status |
| 13 | `13-owner-payments.png` | My payments | owner@example.com | Payment history |
| 14 | `14-receipt-pdf.png` | Receipt PDF | officer or owner | Downloaded receipt PDF preview |

## Folder structure

```txt
docs/
  screenshots/
    01-login.png
    02-admin-dashboard.png
    ...
    14-receipt-pdf.png
  SCREENSHOTS.md
  TESTING_CHECKLIST.md
  API_ENDPOINTS.md
```

## Tips for presentation

- Use seeded data so numbers are consistent (5 properties, mixed bill statuses).
- Highlight the end-to-end flow: register property → assess → bill → pay → receipt.
- Show owner isolation: owner sees only their own records.
- Include one report screenshot with filters applied (e.g. Zone A, tax year 2026).
