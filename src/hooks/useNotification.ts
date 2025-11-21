import { getNotification } from "../services/notification";
import { useQuery } from "@tanstack/react-query";

export function useNotification() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotification(),
  });
}