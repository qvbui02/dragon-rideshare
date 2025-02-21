import { io, Socket } from "socket.io-client";
import { ChatMessage } from "../components/Chat.tsx"; 

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
            console.log("Connected to WebSocket server:", socket?.id);
        });

        socket.on("message", (msg: ChatMessage) => {
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

export const joinChatRoom = (groupId: string) => {
    const socket = getSocket();
    socket.emit("joinRoom", groupId);
};

export const sendMessage = (groupId: string, content: string, username: string, time_created: string) => {
    const socket = getSocket();
    console.log("Sending message:", { groupId, content, username, time_created }); // ✅ Debugging log
    socket.emit("chatMessage", { groupId, content, username, time_created });
};
