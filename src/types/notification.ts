export interface NotificationData {
  // Common IDs
  userId?: string;
  bookingId?: string;
  listingId?: string;
  chatId?: string;
  messageId?: string;

  // Specific fields
  type?: string;
  status?: string;
  creditedAmount?: number;
  deductedAmount?: number;

  [key: string]: any;
}

export interface Notification {
  _id: string;
  user: string; // The ID of the user who received the notification
  title: string;
  message: string;
  type: "booking" | "system" | "listing"; // Strict types for better intellisense
  data: NotificationData;
  isRead: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  __v?: number;
}

export interface NotificationProps {
  page?: number;
  limit?: number;
}
