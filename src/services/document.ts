import api from "@/lib/axios";

export const getUserDocument = async () => {
    const { data } = await api.get("/api/dropdowns/userDocuments");
    return data.data.values;
};

