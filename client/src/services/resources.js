import { apiRequest, buildQuery } from './api';

export const usersApi = {
  list: (params) => apiRequest(`/users${buildQuery(params)}`),
  create: (body) => apiRequest('/users', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => apiRequest(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deactivate: (id) => apiRequest(`/users/${id}`, { method: 'DELETE' }),
};

export const ownersApi = {
  list: (params) => apiRequest(`/owners${buildQuery(params)}`),
  get: (id) => apiRequest(`/owners/${id}`),
  create: (body) => apiRequest('/owners', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => apiRequest(`/owners/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
};

export const propertiesApi = {
  list: (params) => apiRequest(`/properties${buildQuery(params)}`),
  get: (id) => apiRequest(`/properties/${id}`),
  create: (body) => apiRequest('/properties', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => apiRequest(`/properties/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  ownerList: (params) => apiRequest(`/owner/properties${buildQuery(params)}`),
};

export const taxRatesApi = {
  list: (params) => apiRequest(`/tax-rates${buildQuery(params)}`),
  create: (body) => apiRequest('/tax-rates', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => apiRequest(`/tax-rates/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  remove: (id) => apiRequest(`/tax-rates/${id}`, { method: 'DELETE' }),
};

export const assessmentsApi = {
  list: (params) => apiRequest(`/assessments${buildQuery(params)}`),
  get: (id) => apiRequest(`/assessments/${id}`),
  generate: (body) =>
    apiRequest('/assessments/generate', { method: 'POST', body: JSON.stringify(body) }),
};

export const billsApi = {
  list: (params) => apiRequest(`/bills${buildQuery(params)}`),
  get: (id) => apiRequest(`/bills/${id}`),
  create: (body) => apiRequest('/bills', { method: 'POST', body: JSON.stringify(body) }),
  ownerList: (params) => apiRequest(`/owner/bills${buildQuery(params)}`),
};

export const paymentsApi = {
  list: (params) => apiRequest(`/payments${buildQuery(params)}`),
  create: (body) => apiRequest('/payments', { method: 'POST', body: JSON.stringify(body) }),
  ownerList: (params) => apiRequest(`/owner/payments${buildQuery(params)}`),
  ownerPay: (body) => apiRequest('/owner/payments', { method: 'POST', body: JSON.stringify(body) }),
};

export const reportsApi = {
  summary: (params) => apiRequest(`/reports/summary${buildQuery(params)}`),
  collections: (params) => apiRequest(`/reports/collections${buildQuery(params)}`),
  outstanding: (params) => apiRequest(`/reports/outstanding${buildQuery(params)}`),
  byZone: (params) => apiRequest(`/reports/by-zone${buildQuery(params)}`),
  allPdfPath: (params) => `/reports/all/pdf${buildQuery(params)}`,
};

export const auditLogsApi = {
  list: (params) => apiRequest(`/audit-logs${buildQuery(params)}`),
};
