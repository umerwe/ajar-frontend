import api from "@/lib/axios";
import axios from "axios";

export async function getBooking(status?: string) {
  const endpoint = `/api/bookings/user/bookings?zone=68d28f17ee60e62b52de727a&role=renter&status=${status}`;

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4YzJiZjM0MmI1YjkzMTVmM2IyOTI2MSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzU5OTIzNjE1LCJleHAiOjE3NjA1Mjg0MTV9.yCQm8YQ77ptrNyO4KZhFIRHOLreGAVaCHJ-z74s6LcA";

  // Create a *fresh axios instance* with no interceptors
  const tempApi = axios.create({
    baseURL: api.defaults.baseURL,
  });

  // Send this request using only your custom token
  const { data } = await tempApi.get(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data.data;
}


export async function getBookingId(id?: string) {
  const { data } = await api.get(`/api/bookings/${id}`);
  return data.data;
}

