import api from "@/lib/axios";

export const getWallet = async () => {
  const { data } = await api.get("/api/users/wallet");
  return data;
};

export const deductWallet = async (
  {
    amount,
    description,
    bookingId
  }: {
    amount: number;
    description: string;
    bookingId: string;
  }
) => {
  const { data } = await api.post("/api/users/wallet/deduct", {
    amount,
    description,
    bookingId
  });
  return data;
};

export const getBankAccountDetails = async () => {
  const { data } = await api.get("/api/users/bank-account");
  return data.data;
};

export const addBankAccount = async (payload: any) => {
  const { data } = await api.post("/api/users/bank-account", payload);
  return data.data;
};

export const updateBankAccount = async ({
  id,
  payload,
}: {
  id: string;
  payload: any;
}) => {
  const { data } = await api.patch(`/api/users/bank-account/${id}`, payload);
  return data.data;
};

export const deleteBankAccount = async (id: string) => {
  const { data } = await api.delete(`/api/users/bank-account/${id}`);
  return data.data;
};

export const createPaymentIntent = async (amount: number) => {
  const { data } = await api.post("/api/payments/stripe/intent", {
    userAmount: amount,
  });
  return data;
};

export const withdraw = async (amount: number) => {
  const { data } = await api.post("/api/payments/withdraw", {
    amount,
  });
  return data;
};