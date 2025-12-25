export interface MessagePayload {
  chatId: string;
  receiver: string;
  text?: string;
  attachments?: string[];
}

export interface SendMessageProps {
  onSend: (args: { text?: string; fileUrls?: string[] }) => void;
  isSending?: boolean;
  chatId?: string;
  receiverId?: string;
}

export interface FileItem {
  url: string | null;
  name: string;
  isUploading: boolean;
};

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
  attachments?: string[] | undefined;
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
