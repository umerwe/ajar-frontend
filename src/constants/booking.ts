export const status = [
    "Pending",
    "Approved",
    "In Progress",
    "Rejected",
    "Completed",
    "Request Cancelled",
    "Booking Cancelled",
    "Expired",
];

export const statusOptions = ["All", ...status];

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
        
        // ADD THESE CASES
        case "request_cancelled":
        case "cancelled":
            return "bg-[#FF000040] text-[#FF0000]";            
        case "booking_cancelled":
            return "bg-[#6B728040] text-[#6B7280]"; 

        case "rejected":
        case "expired":
            return "bg-[#FF000040] text-[#FF0000]";

        default:
            return "bg-gray-100 text-gray-500";
    }
};