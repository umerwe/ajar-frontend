export function getActionDetails(status?: string) {
  switch (status) {
    case "Pending":
      return { label: "Cancel Request", link: "/" };

    case "Approved":
      return {
        label: "Proceed to pay",
        link: "/checkout",
      };

    case "Completed":
      return { label: "Rate Owner", link: "#" };

    default:
      return { label: "Unknown", link: "/" };
  }
}
