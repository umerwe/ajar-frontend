import axios from "axios";
import { baseURL } from "@/config/constants";

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const code = error.response?.data?.code;

    if (status === 403 && code === "USER_BLOCKED") {
      localStorage.removeItem("token");
      window.location.href = `/account-status/blocked`;
    }
    
    return Promise.reject(error);
  }
);

export default api;