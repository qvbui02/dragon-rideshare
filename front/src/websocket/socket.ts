import { io, Socket } from "socket.io-client";

const SERVER_URL = "http://localhost:3000";

let socket: Socket | null = null;

export const connectSocket = () => {
    if (!socket) { 
        socket = io(SERVER_URL, {
            reconnection: true, 
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socket.on("connect", () => {
        });

        socket.on("message", () => {
        });

        socket.on("disconnect", () => {
        });
    }
    return socket;
};

export const getSocket = () => {
    if (!socket) {
        throw new Error("Socket not initialized. Call connectSocket() first.");
    }
    return socket;
};

export const joinChatRoom = (trip_id: string) => {
    const socket = getSocket();
    socket.emit("joinRoom", trip_id);
};

export const sendMessage = (trip_id: string, message: string, sender_id: number, username: string, sent_at: string) => {
    const socket = getSocket();
    socket.emit("chatMessage", { trip_id, message, sender_id, username, sent_at });
};
