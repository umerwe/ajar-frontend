import { Verification } from "@/validations/auth";
import api from "@/lib/axios";

export const verifyUserByEmail = async (credentials: Verification) => {
  const { data } = await api.post("/api/users/verify-otp", credentials);
  return data.data;
};

export const resendVerificationByEmail = async (credentials: any) => {
  const { data } = await api.post("/api/users/resend-otp", credentials);
  return data.data;
};
