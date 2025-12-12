export const formatStatus = (status: string) =>
    status
        .replace(/_/g, " ")
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
