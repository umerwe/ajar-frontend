import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
    if (!socket) {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

        socket = io("http://192.168.18.64:5000", {
            transports: ["websocket"],
            withCredentials: true,
            auth: {
                token,
            },
        });
    }
    return socket;
};
