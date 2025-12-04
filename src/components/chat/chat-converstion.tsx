"use client"

import { useGetMessages } from "@/hooks/useChat"
import { socket } from "@/lib/socket"
import Image from "next/image"
import { useUser } from "@/hooks/useAuth"
import { useEffect, useRef, useState, useCallback } from "react"
import { capitalizeWords } from "@/utils/capitalizeWords"
import SendMessage from "./send-message"
import SkeletonLoader from "../common/skeleton-loader"
import type { Message, MessagePayload } from "@/types/chat"
import { MessageSquare } from "lucide-react"

const ChatConversation = ({ id: chatId }: { id?: string }) => {
  const { data: user } = useUser()
  const [messages, setMessages] = useState<Message[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const [isChatActive, setIsChatActive] = useState(false)
  const { data, isLoading } = useGetMessages(chatId as string, currentPage)
  const scrollRef = useRef<HTMLDivElement>(null)
  const prevScrollHeightRef = useRef<number>(0)
  const isLoadingOldMessagesRef = useRef(false)
  const initialLoadRef = useRef(true)
  const lastPageLoadedRef = useRef(0)

  // Handle data updates
  useEffect(() => {
    if (data?.messages?.length) {
      if (currentPage === 1) {
        setMessages(data.messages.reverse())
        initialLoadRef.current = true // Mark for initial scroll
        setIsLoadingMore(false)
        lastPageLoadedRef.current = 1
      } else {
        // Only add messages if this is a new page load
        if (lastPageLoadedRef.current !== currentPage) {
          // Store scroll position before adding new messages
          prevScrollHeightRef.current = scrollRef.current?.scrollHeight || 0
          isLoadingOldMessagesRef.current = true
          setMessages((prev) => [...data.messages.reverse(), ...prev])
          lastPageLoadedRef.current = currentPage
        }
      }
      setHasMore(data.hasMore ?? true)
    } else if (data && !data.messages?.length && currentPage > 1) {
      // No more messages to load
      setHasMore(false)
      setIsLoadingMore(false)
    }
  }, [data, currentPage])

  // Handle scroll position after messages update
  useEffect(() => {
    if (!scrollRef.current) return

    const container = scrollRef.current

    if (isLoadingOldMessagesRef.current && lastPageLoadedRef.current === currentPage) {
      // When loading old messages, maintain scroll position
      const newScrollHeight = container.scrollHeight
      const heightDifference = newScrollHeight - prevScrollHeightRef.current
      container.scrollTop = heightDifference
      isLoadingOldMessagesRef.current = false
      setIsLoadingMore(false)
    } else if (initialLoadRef.current && messages.length > 0 && !isLoading) {
      // Only scroll to bottom on initial load or after refresh
      setTimeout(() => {
        container.scrollTop = container.scrollHeight
        initialLoadRef.current = false
      }, 50)
    }
  }, [messages, isLoading, currentPage])

  // Handle infinite scroll
  const handleScroll = useCallback(() => {
    if (!scrollRef.current || !hasMore || isLoadingMore || isLoading) return

    const container = scrollRef.current
    const isNearTop = container.scrollTop < 100

    if (isNearTop && !isLoadingOldMessagesRef.current) {
      setIsLoadingMore(true)
      prevScrollHeightRef.current = container.scrollHeight
      setCurrentPage((prev) => prev + 1)
    }
  }, [hasMore, isLoadingMore, isLoading])

  // Socket event handlers
  useEffect(() => {
    if (!socket || !chatId) return

    socket.emit("chat:join", { chatId })
    setIsChatActive(true)

    const handleMessageSent = (message: Message) => {
      setMessages((prev) => {
        if (prev.some((msg) => msg._id === message._id)) return prev
        return [...prev, message]
      })
      // Don't interfere with pagination flags
    }

    const handleMessageReceived = (message: Message) => {
      setMessages((prev) => {
        if (prev.some((msg) => msg._id === message._id)) return prev
        return [...prev, message]
      })
      // Don't interfere with pagination flags

      if (isChatActive && document.visibilityState === "visible") {
        socket?.emit("message:deliver", { messageId: message._id })
      }
    }

    const handleMessageDelivered = (data: { messageId: string; deliveredAt: Date }) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === data.messageId ? { ...msg, deliveredAt: new Date(data.deliveredAt) } : msg)),
      )
    }

    const handleMessageRead = (data: { messageId: string; readAt: Date }) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === data.messageId ? { ...msg, readAt: new Date(data.readAt), seen: true } : msg)),
      )
    }

    socket.on("message:sent", handleMessageSent)
    socket.on("message:received", handleMessageReceived)
    socket.on("message:delivered", handleMessageDelivered)
    socket.on("message:read", handleMessageRead)

    return () => {
      socket?.off("message:sent", handleMessageSent)
      socket?.off("message:received", handleMessageReceived)
      socket?.off("message:delivered", handleMessageDelivered)
      socket?.off("message:read", handleMessageRead)
      socket?.emit("chat:leave", { chatId })
      setIsChatActive(false)
    }
  }, [chatId, isChatActive])

  const handleSend = ({ text, fileUrls }: { text?: string; fileUrls?: string[] }) => {
    if (!user || !chatId || !data?.receiver?._id) return

    const payload: MessagePayload = {
      chatId,
      receiver: data.receiver._id,
    }

    if (text) payload.text = text
    if (fileUrls && fileUrls.length > 0) payload.attachments = fileUrls

    socket?.emit("message:send", payload)
  }

  const getMessageType = (msg: Message) => {
    const hasText = !!msg.text?.trim()
    const hasAttachments = msg.attachments && msg.attachments.length > 0

    if (hasText && hasAttachments) return "mixed"
    if (hasAttachments) return "media"
    return "text"
  }

  return (
    <div className="flex flex-col h-full w-full bg-white border shadow">
      <div className="flex items-center gap-3 p-4 border-b">
        {isLoading && currentPage === 1 ? (
          <>
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
            <div className="flex-1">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
          </>
        ) : (
          <>
            {data?.receiver?.profilePicture ? (
              <Image
                src={process.env.NEXT_PUBLIC_API_BASE_URL + data?.receiver?.profilePicture || "/placeholder.svg"}
                alt={data?.receiver?.name || "User"}
                width={256}
                height={256}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-aqua flex items-center justify-center text-white font-semibold text-lg">
                {data?.receiver?.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <div className="flex-1">
              <p className="font-semibold">{capitalizeWords(data?.receiver?.name)}</p>
            </div>
          </>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-3" onScroll={handleScroll}>
        {/* Show loader only when loading more messages AND there are more messages to load */}
        {isLoadingMore && hasMore && currentPage > 1 && (
          <div className="flex justify-center py-2">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-aqua border-t-transparent" />
          </div>
        )}

        {isLoading && currentPage === 1 && <SkeletonLoader variant="messages" count={6} />}

        {messages
          ?.filter((msg) => msg.chatId === chatId)
          ?.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          ?.map((msg) => {
            const isSent = msg.sender?._id === user?._id
            const sender = msg.sender || {}
            const hasImage = sender.profilePicture
            const messageType = getMessageType(msg)

            return (
              <div key={msg._id} className={`flex ${isSent ? "justify-end" : "justify-start"} group`}>
                <div className={`flex gap-2 max-w-[70%] ${isSent ? "flex-row-reverse" : "flex-row"}`}>
                  <div className="flex-shrink-0">
                    {hasImage ? (
                      <Image
                        src={(process.env.NEXT_PUBLIC_API_BASE_URL || "") + (sender?.profilePicture || "")}
                        alt={sender?.name || "User"}
                        width={256}
                        height={256}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-aqua flex items-center justify-center text-white text-sm font-semibold">
                        {sender.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}
                  </div>

                  <div className={`flex flex-col ${isSent ? "items-end" : "items-start"}`}>
                    {!isSent && (
                      <div className="text-xs font-medium text-gray-500 mb-1 px-2">{capitalizeWords(sender.name)}</div>
                    )}

                    <div
                      className={`rounded-2xl px-4 py-2 ${isSent ? "bg-aqua text-white rounded-br-md" : "bg-gray-100 text-gray-800 rounded-bl-md"
                        } ${messageType === "mixed" ? "space-y-3" : ""}`}
                    >
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className={`grid gap-2 ${msg.attachments.length > 1 ? "grid-cols-2" : ""}`}>
                          {msg.attachments.map((fileUrl, idx) => (
                            <div key={idx} className="relative">
                              <Image
                                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${fileUrl}`}
                                alt="attachment"
                                width={200}
                                height={200}
                                className="rounded-lg object-cover w-full h-auto max-w-[150px]"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {msg.text && (
                        <div className={`${messageType === "media" ? "mt-2" : ""}`}>
                          <p className="text-sm leading-relaxed break-words">{msg.text}</p>
                        </div>
                      )}
                    </div>

                    <div className={`text-[10px] text-gray-400 mt-1 px-2 ${isSent ? "text-right" : "text-left"}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

        {!isLoading && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full py-10 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center shadow-sm">
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>

            <h3 className="text-sm font-semibold text-foreground mt-3">No messages yet</h3>

            <p className="text-xs text-muted-foreground mt-1">Start a conversation</p>
          </div>
        )}
      </div>

      <SendMessage onSend={handleSend} isSending={false} chatId={chatId} receiverId={data?.receiver?._id} />
    </div>
  )
}

export default ChatConversation