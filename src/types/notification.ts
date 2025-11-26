export interface NotificationData {
  type: string;
  listingId: string;
}

export interface Notification {
  _id: string;
  title: string;
  message: string;
  createdAt: string | Date;
  isRead: boolean;
  data: NotificationData;
}