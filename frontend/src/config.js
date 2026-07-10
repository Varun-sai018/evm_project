
const rawUrl = import.meta.env.VITE_API_URL || "http://localhost:8056";
export const API_BASE_URL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl}/api`;

