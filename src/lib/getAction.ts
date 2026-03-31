export function getActionDetails(status?: string) {
  switch (status) {
    case "pending":
      return { label: "Cancel Request", link: "/" };

    case "approved":
      return {
        label: "Submit Pin",
      };

    case "booking_cancelled":
      return { label: "Booking Cancelled", link: "#" };

    case "in_progress":
      return {
        label: "Extend Rental"
      }

    case "completed":
      return { label: "Rate Owner", link: "#" };

    case "request_cancelled":
      return { label: "Request Cancelled", link: "#" };

    case "rejected":
      return { label: "Rejected", link: "#" };

    case "expired":
      return { label: "Expired", link: "#" };

    default:
      return { label: "Unknown", link: "/" };
  }
}
