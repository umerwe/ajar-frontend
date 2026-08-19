import axios, { AxiosHeaders } from "axios";
import { baseURL } from "@/config/constants";

const api = axios.create({ baseURL });

const getCurrentLocale = () => {
  if (typeof window === "undefined") return "en";

  const locale = window.location.pathname.split("/").filter(Boolean)[0];
  return locale === "ar" ? "ar" : "en";
};

api.interceptors.request.use((config) => {
  const language = getCurrentLocale();

  api.defaults.headers.common["language"] = language;
  config.headers = AxiosHeaders.from(config.headers);
  config.headers.set("language", language);

  const token = localStorage.getItem("token");
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
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
