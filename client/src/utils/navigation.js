export const adminNav = [
  { label: 'Dashboard', path: '/admin' },
  { label: 'Users', path: '/admin/users' },
  { label: 'Owners', path: '/admin/owners' },
  { label: 'Properties', path: '/admin/properties' },
  { label: 'Tax Rates', path: '/admin/tax-rates' },
  { label: 'Bills', path: '/admin/bills' },
  { label: 'Payments', path: '/admin/payments' },
  { label: 'Reports', path: '/admin/reports' },
  { label: 'Audit Logs', path: '/admin/audit-logs' },
];

export const officerNav = [
  { label: 'Dashboard', path: '/officer' },
  { label: 'Owners', path: '/officer/owners' },
  { label: 'Properties', path: '/officer/properties' },
  { label: 'Assessments', path: '/officer/assessments' },
  { label: 'Bills', path: '/officer/bills' },
  { label: 'Payments', path: '/officer/payments' },
  { label: 'Receipts', path: '/officer/receipts' },
  { label: 'Reports', path: '/officer/reports' },
];

export const ownerNav = [
  { label: 'Dashboard', path: '/owner' },
  { label: 'My Properties', path: '/owner/properties' },
  { label: 'My Bills', path: '/owner/bills' },
  { label: 'My Payments', path: '/owner/payments' },
  { label: 'My Receipts', path: '/owner/receipts' },
];

export const roleLabels = {
  admin: 'Administrator',
  officer: 'Tax Officer',
  owner: 'Property Owner',
};
