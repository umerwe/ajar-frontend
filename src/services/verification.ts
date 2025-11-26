import api from "@/lib/axios";

export const verifyUserByEmail = async (credentials: { email: string, otp: string }) => {
  const { data } = await api.post("/api/users/verify-otp", credentials);
  return data.data;
};

export const resendVerificationByEmail = async (email: string) => {
  const { data } = await api.post("/api/users/resend-otp", { email: email });
  return data.data;
};
