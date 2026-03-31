const slugify = (str: string) => {
  if (!str) return "";
  const lower = str.toLowerCase();
  if (lower === "in progress") return "in_progress";
  if (lower === "booking cancelled") return "booking_cancelled";
  if (lower === "request cancelled") return "request_cancelled";
  return lower;
};

const formatStatus = (status: string) => {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export { formatStatus, slugify };