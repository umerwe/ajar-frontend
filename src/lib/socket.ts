import { io, Socket } from "socket.io-client";

export let socket: Socket | null = null;

export const getSocket = (): Socket => {
    if (!socket) {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

        socket = io("http://104.128.190.131:5000", {
            transports: ["websocket"],
            withCredentials: true,
            auth: {
                token,
            },
        });
    }
    return socket;
};
