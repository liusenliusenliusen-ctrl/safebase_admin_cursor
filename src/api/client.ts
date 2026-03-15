import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "";

export const adminApi = axios.create({
  baseURL: baseURL || undefined,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

adminApi.interceptors.request.use((config) => {
  const key = localStorage.getItem("admin_key");
  if (key) {
    config.headers["X-Admin-Key"] = key;
  }
  return config;
});

adminApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("admin_key");
      window.dispatchEvent(new Event("admin:logout"));
    }
    return Promise.reject(err);
  }
);
