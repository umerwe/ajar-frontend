import { getZoneList } from "@/services/zone";
import { useQuery } from "@tanstack/react-query";

export function useGetZones() {
    return useQuery({
        queryKey: ["zones"],
        queryFn: () => getZoneList(),
    })
};