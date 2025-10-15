import ChatList from "@/components/chat/chat-list";
import { MessageSquare } from "lucide-react";

const ChatPage = () => {
  return (
    <div className="flex h-screen w-full bg-gray-100">
      <div className="w-full max-w-sm border-r bg-white">
        <ChatList />
      </div>

      <div className="flex-1 bg-white flex flex-col items-center justify-center text-center p-6">
        <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-1">
          No Chat Selected
        </h2>
        <p className="text-gray-500 text-sm max-w-sm">
          Select a conversation from the left panel to start chatting.  
          Once you do, your messages will appear here.
        </p>
      </div>
    </div>
  );
};

export default ChatPage;
