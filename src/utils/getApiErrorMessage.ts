import { AxiosError } from "axios";

type ApiErrorResponse = {
  message?: string;
  error?: string;
  errors?: Array<{ message?: string } | string>;
};

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  const err = error as AxiosError<ApiErrorResponse>;
  const data = err.response?.data;

  if (data?.message) return data.message;
  if (data?.error) return data.error;

  const firstError = data?.errors?.[0];
  if (typeof firstError === "string") return firstError;
  if (firstError?.message) return firstError.message;

  return fallback;
};
