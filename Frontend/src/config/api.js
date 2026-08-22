// Centralized API Base URL configuration for Frontend
const getApiBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:5500/api";
  // Remove trailing slash if present
  url = url.replace(/\/+$/, "");
  // Ensure it ends with /api if not already included
  if (!url.endsWith("/api")) {
    url += "/api";
  }
  return url;
};

export const API_BASE_URL = getApiBaseUrl();
export default API_BASE_URL;
