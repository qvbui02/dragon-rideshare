import { Server, Socket } from "socket.io";
import { saveMessage, getChatHistory } from "../services/chat.service.js";
import { formatMessage } from "../utils/socketHelpers.js";
import { socketAuthMiddleware } from "../middlewares/auth.middleware.js";

export interface ChatMessage {
    username: string;
    text: string;
    time: string;
}


export const initChatServer = (io: Server) => {
    io.use(socketAuthMiddleware);

    io.on("connection", (socket: Socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on("joinRoom", (roomId: string) => {
            socket.join(roomId);
            socket.emit("message", formatMessage("Server", "Welcome to the chat!"));
        });

        socket.on("chatMessage", ({ roomId, message, username }: { roomId: string, message: string, username: string }) => {
            const formattedMessage = formatMessage(username, message);
            saveMessage(roomId, formattedMessage);
            io.to(roomId).emit("message", formattedMessage);
        });

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};
