export function getActionDetails(status?: string) {
  switch (status) {
    case "pending":
      return { label: "Cancel Request", link: "/" };

    case "approved":
      return {
        label: "Proceed to pay",
      };
    case "in_progress":
      return {
        label: "Extend Rental"
      }

    case "completed":
      return { label: "Rate Owner", link: "#" };

    case "cancelled":
      return { label: "Cancelled", link: "#" };

    case "rejected":
      return { label: "Rejected", link: "#" };

    default:
      return { label: "Unknown", link: "/" };
  }
}
