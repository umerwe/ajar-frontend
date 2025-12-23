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