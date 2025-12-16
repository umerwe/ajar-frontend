export const rawOptions = [
    "Pending",
    "Approved",
    "In Progress",
    "Rejected",
    "Completed",
    "Cancelled",
];

export const statusOptions = ["All", ...rawOptions];

export const getStatusStyles = (status: string): string => {
    switch (status) {
        case "pending":
            return "bg-[#FF8C0040] text-[#FF8C00]";

        case "approved":
            return "bg-[#01C89B36] text-aqua";

        case "in_progress":
            return "bg-[#80008040] text-[#800080]";

        case "completed":
            return "bg-[#288D0040] text-[#288D00]";

        case "rejected":
            return "bg-[#FF000040] text-[#FF0000]";

        case "cancelled":
            return "bg-[#FF000040] text-[#FF0000]";

        default:
            return "bg-[#FF000040] text-[#FF0000]";
    }
};