import { baseUrl } from "@/config/constants";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
    if (!socket) {
        socket = io(baseUrl, {
            transports: ["websocket"],
            withCredentials: true,
            query: {
                token: localStorage.getItem("token"),
            },
        });
    }
    return socket;
};