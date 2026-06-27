import { storage } from '../utils/storage';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function parseResponse(response) {
  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = data?.message || data?.error || response.statusText || 'Request failed';
    throw new ApiError(message, response.status, data);
  }

  return data;
}

export async function apiRequest(path, options = {}) {
  const { auth = true, headers: customHeaders, ...rest } = options;

  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  if (auth) {
    const token = storage.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers,
  });

  return parseResponse(response);
}

export function buildQuery(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, value);
    }
  });
  const query = search.toString();
  return query ? `?${query}` : '';
}
