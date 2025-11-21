import api from "@/lib/axios";
import { Login, Register } from "@/validations/auth";

export const getUser = async () => {
  const { data } = await api.get(`/api/users/details`);
  return data.data.user
}

export const updateUser = async (formData: FormData) => {
  const { data } = await api.put(`/api/users/profile`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return data.data.user
}

export const loginUser = async (credentials: Login) => {
  const { data } = await api.post("/api/users/login", credentials);
  return data.data.token;
};

export const signUpUser = async (credentials: Register) => {
  await api.post("/api/users/signup", credentials);
};

export const forgotPassword = async (email: string) => {
  await api.post("/api/users/forgot-password", { email });
};

export const resetPassword = async ({ email, password }: { email: string, password: string }) => {
  await api.post("/api/users/reset-password", { email, password });
};


