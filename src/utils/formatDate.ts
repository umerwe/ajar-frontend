type DateInput = string | number | Date | null | undefined;

const toValidDate = (date: DateInput) => {
  if (!date) return null;

  const parsedDate = date instanceof Date ? date : new Date(date);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

export const formatWalletDate = (date: DateInput) => {
  const parsedDate = toValidDate(date);
  if (!parsedDate) return "";

  return parsedDate
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(/:(\d{2}) /, ":$1 ");
};

export const formatBookingDate = (
  dateString: string,
  unit: string,
) => {
  const date = new Date(dateString);

  if (unit === "hour") {
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).replace(/\//g, " ");
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
};
