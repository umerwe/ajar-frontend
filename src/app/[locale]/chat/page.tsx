import ChatConversation from "@/components/chat/chat-converstion";
import ChatList from "@/components/chat/chat-list";

const ChatPage = () => {
  return (
    <div className="flex h-screen w-full bg-gray-100">
      {/* Sidebar (Chat List) */}
      <div className="w-full max-w-sm border-r bg-white">
        <ChatList />
      </div>

      {/* Main Chat Window */}
      <div className="flex-1 bg-white static">
        <ChatConversation />
      </div>
    </div>
  );
};

export default ChatPage;
