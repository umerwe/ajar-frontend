import api from "@/lib/axios";

export async function sendReport(formData: FormData) {
    const response = await api.post(`/api/tickets`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
}
