import { baseUrl } from "@/config/constants";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
    if (!socket) {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

        socket = io(baseUrl, {
            transports: ["websocket"],
            withCredentials: true,
            auth: {
                token,
            },
        });
    }
    return socket;
};
