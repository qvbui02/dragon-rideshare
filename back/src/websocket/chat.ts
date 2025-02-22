import { Server, Socket } from "socket.io";

export const initChatServer = (io: Server) => {
    io.on("connection", (socket: Socket) => {

        socket.on("joinRoom", (trip_id: string) => {
            socket.join(trip_id);
        });

        socket.on("chatMessage", ({ trip_id, message, sender_id, username, sent_at}) => {
            io.to(trip_id).emit("message", { trip_id: trip_id, message: message, sender_id: sender_id, username: username, sent_at: sent_at });
        });

        socket.on("disconnect", () => {
        });
    });
};
