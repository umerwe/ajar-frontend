export interface MessagePayload {
  chatId: string;
  receiver: string;
  text: string;
}

export interface SendMessageProps {
    chatId: string;
    receiverId: string;
}

export interface Message {
  _id: string;
  chatId?: string;
  sender: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  receiver?: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  text: string;
  createdAt: string;
  updatedAt?: string;
  error?: boolean;
}

export interface Participant {
  _id: string;
  name: string;
  profilePicture?: string;
}

export interface Chat {
  _id: string;
  participants: Participant[];
  unreadCount?: number;
  updatedAt: string;
}
