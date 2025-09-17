export function getActionDetails(status?: string) {
  switch (status) {
    case "Pending":
      return { label: "Cancel Request", link: "/" };

    case "Approved":
      return {
        label: "Proceed to pay",
        link: "/listing/veh341/C6F0Y3/checkout",
      };

    case "Completed":
      return { label: "Rate Owner", link: "#" };

    default:
      return { label: "Unknown", link: "/" };
  }
}
