interface Message {
    username: string;
    text: string;
    time: string;
}

const chatRooms: Record<string, Message[]> = {}; // Store messages as an array of objects

export const saveMessage = (roomId: string, message: Message) => { // Accepts a Message object
    if (!chatRooms[roomId]) chatRooms[roomId] = [];
    chatRooms[roomId].push(message); // Store as an object
};


export const getChatHistory = (roomId: string) => {
    return chatRooms[roomId] || [];
};