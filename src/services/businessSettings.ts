import api from "@/lib/axios";

export const getBusinessSettings = async (
    pageName: SettingsPageName
) => {
    const response = await api.get(`/api/businessSetting/${pageName}`);
    return response.data.data;
};