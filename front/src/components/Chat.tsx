import React, { useEffect, useState } from "react";
import { connectSocket } from "../websocket/socket";
import { joinChatRoom, sendMessage } from "../websocket/chat";
import { ChatMessage } from "../types"; // Import the message type

const Chat: React.FC = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<string[]>([]);
    const roomId = "room1"; // Example room

    useEffect(() => {
        const token = localStorage.getItem("token") || "test-token"; // Replace with real auth token
        const socket = connectSocket(token);

        socket.on("message", (msg: ChatMessage) => {  // ✅ Fix: Explicitly define msg type
            setMessages((prev) => [...prev, msg.text]);
        });

        joinChatRoom(roomId);

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleSendMessage = () => {
        if (!message.trim()) return; // Prevent empty messages
    
        const newMessage: ChatMessage = {
            username: "User123",
            text: message,
            time: new Date().toISOString(),
        };
    
        sendMessage(roomId, message, "User123");
    
        setMessages((prev) => [...prev, newMessage.text]);
    
        setMessage(""); // Clear input field
    };

    return (
        <div>
            <h2>Chat Room</h2>
            <div>
                {messages.map((msg, index) => (
                    <p key={index}>{msg}</p>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
};

export default Chat;
