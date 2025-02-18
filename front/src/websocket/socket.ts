import { io, Socket } from "socket.io-client";
import { ChatMessage } from "../types"; // ✅ Import ChatMessage type

const SERVER_URL = "http://localhost:3000"; // Change this for production

let socket: Socket | null = null;

export const connectSocket = (token: string) => {
    if (!socket) {
        socket = io(SERVER_URL, {
            auth: { token },
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socket.on("connect", () => {
            console.log("Connected to WebSocket server:", socket?.id);
        });

        socket.on("message", (msg: ChatMessage) => { // ✅ Explicitly define msg type
            console.log("Message from server:", msg);
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from server");
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
