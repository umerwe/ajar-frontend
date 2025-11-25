import api from "@/lib/axios";

export const enableTwoFactor = async () => {
    const response = await api.post("/api/2fa/enable");
    return response.data;
};

export const startTwoFactor = async () => {
    const response = await api.post("/api/2fa/start");
    return response.data;
};

export const verifyTwoFactor = async ({ token ,authToken}: { token: string ,authToken?: string }) => {
    const response = await api.post("/api/2fa/verify", { token }, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`
        }

    });
    return response.data;
};

export const disableTwoFactor = async () => {
    const response = await api.post("/api/2fa/disable");
    return response.data;
};