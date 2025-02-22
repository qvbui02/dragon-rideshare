import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { connectSocket, joinChatRoom, sendMessage } from "../websocket/socket";
import { fetchHistoricMessages, saveMessages } from "../services/message";


export interface ChatMessage {
    trip_id: string,
    sender_id: number,
    username: string;
    message: string,
    sent_at: string
}

import { Container, TextField, Button, Typography, Paper, Box } from "@mui/material";
import { AuthContext } from "../contexts/AuthContext";

const Chat: React.FC = () => {
    const { trip_id } = useParams<{ trip_id: string }>();
    const { user } = useContext(AuthContext)
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [socket, setSocket] = useState<any>(null);

    useEffect(() => {
        if (!trip_id) return;

        const newSocket = connectSocket();
        setSocket(newSocket);

        newSocket.on("connect", () => {
        });

        joinChatRoom(trip_id);

        newSocket.on("message", (msg: ChatMessage) => {
            setMessages((prev) => [...prev, msg]);
        });

        fetchHistoricMessages(trip_id)
        .then((data) => {
            setMessages(data);
        })

        return () => {
            newSocket.disconnect();
        };
    }, [trip_id]);

    const handleSendMessage = async () => {
        if (!message.trim() || !trip_id || !socket || user?.full_name === undefined) return;
    
        const sender_id = Number(user.user_id);
        const sent_at = new Date().toISOString();
        const username = user.full_name;
    
        try {
            await saveMessages(trip_id, message, sent_at); 
            sendMessage(trip_id, message, sender_id, username, sent_at);
            setMessage(""); 
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };
    

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Chat Room {trip_id}
                </Typography>

                {/* Chat Messages */}
                <Box
                    sx={{
                        height: 300,
                        overflowY: "auto",
                        padding: 2,
                        borderRadius: 1,
                        backgroundColor: "#f5f5f5",
                        marginBottom: 2,
                    }}
                >
                    {messages.length > 0 ? (
                        messages.map((msg, index) => (
                            <Typography key={index} variant="body2" sx={{ marginBottom: 1 }}>
                                <strong>{msg.username}:</strong> {msg.message}
                            </Typography>
                        ))
                    ) : (
                        <Typography color="textSecondary" align="center">
                            No messages yet
                        </Typography>
                    )}
                </Box>

                {/* Input and Send Button */}
                <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                        fullWidth
                        label="Type a message..."
                        variant="outlined"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown} // Send message on Enter key
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSendMessage}
                    >
                        Send
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Chat;
