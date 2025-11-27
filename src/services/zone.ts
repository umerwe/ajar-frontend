import api from "@/lib/axios";

export async function getZoneList() {
  const { data } = await api.get("/api/zones");
  return data.data;
}