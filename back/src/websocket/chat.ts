import { Server, Socket } from "socket.io";

export const initChatServer = (io: Server) => {
    io.on("connection", (socket: Socket) => {

        socket.on("joinRoom", (groupId: string) => {
            socket.join(groupId);
            socket.emit("message", { username: "Server", content: "Welcome to the chat!", time_created: new Date().toISOString() });
        });

        socket.on("chatMessage", ({ groupId, content, username, time_created}) => {

            io.to(groupId).emit("message", { username, content: content, time_created: time_created });
        });

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};
