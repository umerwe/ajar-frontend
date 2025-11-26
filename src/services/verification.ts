import { Verification } from "@/validations/auth";
import api from "@/lib/axios";

export const verifyUserByEmail = async (credentials: Verification) => {
  const { data } = await api.post("/api/users/verify-otp", credentials);
  console.log(data)
  return data.data;
};

export const resendVerificationByEmail = async (email: {email: string}) => {
  const { data } = await api.post("/api/users/resend-otp", {email});
  return data.data;
};
