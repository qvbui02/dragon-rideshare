import { getSocket } from "./socket";

export const joinChatRoom = (roomId: string) => {
    const socket = getSocket();
    socket.emit("joinRoom", roomId);
};

export const sendMessage = (roomId: string, message: string, username: string) => {
    const socket = getSocket();
    socket.emit("chatMessage", { roomId, message, username });
};
