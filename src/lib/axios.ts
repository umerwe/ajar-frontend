import axios from "axios";
import { baseURL } from "@/config/constants";
const api = axios.create({
  baseURL
});

// Interceptor to add token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;