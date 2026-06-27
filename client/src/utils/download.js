import { storage } from './storage';

const API_URL = import.meta.env.VITE_API_URL || '/api';

function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export async function downloadPdf(path, filename) {
  const token = storage.getToken();
  const response = await fetch(`${API_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!response.ok) {
    let message = 'Download failed';
    try {
      const data = await response.json();
      message = data.message || message;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  const blob = await response.blob();
  downloadBlob(blob, filename);
}

export function downloadText(filename, content, type = 'text/plain;charset=utf-8') {
  downloadBlob(new Blob([content], { type }), filename);
}
