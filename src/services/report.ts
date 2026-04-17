import api from "@/lib/axios";

export async function sendReport(formData: FormData) {
    const response = await api.post(`/api/tickets`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
}


export async function updateDamageReportStatus({
    bookingId,
    action
}: {
    bookingId: string;
    action: "approve" | "reject"
}) {
    const response = await api.patch(`/api/tickets/damage-report/status`, {
        bookingId,
        action
    });
    return response.data;
}