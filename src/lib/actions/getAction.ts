export function getActionDetails(status?: string) {
  switch (status) {
    case "pending":
      return { label: "Cancel Request", link: "/" };

    case "approved":
      return {
        label: "Proceed to pay",
      };

    case "completed":
      return { label: "Rate Owner", link: "#" };

    default:
      return { label: "Unknown", link: "/" };
  }
}
