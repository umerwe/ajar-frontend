"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Socket } from "socket.io-client";
import { getSocket } from "@/lib/socket";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket] = useState(() => getSocket());
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    if (!socket) return;

    const onConnect = () => {
      console.log("✅ Socket connected:", socket.id);
      setIsConnected(true);
    };

    const onDisconnect = (reason: string) => {
      console.log("❌ Socket disconnected. Reason:", reason);
      setIsConnected(false);
    };

    const onConnectError = (err: Error) => {
      console.error("⚠️ Socket connection error:", err.message);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);