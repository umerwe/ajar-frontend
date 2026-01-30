import api from "@/lib/axios";

export async function sendRefundRequest(formData: FormData) {
    const response = await api.post(`/api/refunds/user`, formData);

    return response.data;
}