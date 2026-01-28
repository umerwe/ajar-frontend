import { io, Socket } from "socket.io-client";

export let socket: Socket | null = null;

export const getSocket = (): Socket => {
    if (!socket) {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

        socket = io(process.env.NEXT_PUBLIC_API_BASE_URL, {
            transports: ["websocket"],
            withCredentials: true,
            auth: {
                token,
            },
        });
    }
    return socket;
};
