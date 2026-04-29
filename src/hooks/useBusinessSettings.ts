import { getBusinessSettings } from "@/services/businessSettings";
import { useQuery } from "@tanstack/react-query";

export const useGetBusinessSettings = (pageName: SettingsPageName) => {
  return useQuery({
    queryKey: ["business-settings", pageName],
    queryFn: () => getBusinessSettings(pageName),
    placeholderData: (previousData) => previousData,
  });
};