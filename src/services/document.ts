import api from "@/lib/axios";

export const getUserDocument = async () => {
    const { data } = await api.get("/api/dropdowns/userDocuments");
    return data.data.values;
};

export const removeDocumentFile = async (fileUrl: string) => {
    const { data } = await api.delete("/api/users/documents/file", {
        data: { fileUrl },
    });
    return data;
};

