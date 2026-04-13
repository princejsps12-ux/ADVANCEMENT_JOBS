/** Dev: Vite proxies /api → backend (avoids CORS for localhost vs 127.0.0.1). */
export const API_BASE = import.meta.env.DEV
  ? '/api'
  : (import.meta.env.VITE_API_BASE || 'http://localhost:5000/api');
