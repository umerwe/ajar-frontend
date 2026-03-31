import { Notification } from "@/types/notification";

export const getNotificationLink = (item: Notification): string => {
    const type = item.type;
    switch (type) {
        case "booking":
            return `/booking/details/${item.data?.bookingId}`;

        case "system":
            if(item.title === "Document Expiring Soon" || item.title === "Document Expired"){
                return "/profile";
            }
            if (item.data?.chatId) {
                return `/chat?id=${item.data.chatId}`;
            }
            return "/wallet";

        case "listing":
            return `/listing/${item.data?.subCategory}/${item.data?.listingId}`;

        default:
            return "/notifications";
    }
};