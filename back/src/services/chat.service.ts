const chatRooms: Record<string, string[]> = {}; // In-memory storage for messages

export const saveMessage = (roomId: string, message: string) => {
    if (!chatRooms[roomId]) chatRooms[roomId] = [];
    chatRooms[roomId].push(message);
};

export const getChatHistory = (roomId: string) => {
    return chatRooms[roomId] || [];
};