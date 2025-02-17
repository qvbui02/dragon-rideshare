import { Server } from "socket.io";
import { saveMessage, getChatHistory } from "../services/chat.service";
import { formatMessage } from "../utils/socketHelpers";
import { socketAuthMiddleware } from "../middlewares/auth.middleware";

export const initChatServer = (io: Server) => {
    io.use(socketAuthMiddleware);

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on("joinRoom", (roomId) => {
            socket.join(roomId);
            socket.emit("message", formatMessage("Server", "Welcome to the chat!"));
        });

        socket.on("chatMessage", ({ roomId, message, username }) => {
            const formattedMessage = formatMessage(username, message);
            saveMessage(roomId, formattedMessage);
            io.to(roomId).emit("message", formattedMessage);
        });

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};
