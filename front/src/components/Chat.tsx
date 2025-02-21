import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { connectSocket, joinChatRoom, sendMessage } from "../websocket/socket";

export interface ChatMessage {
    groupId: string,
    username: string,
    content: string,
    time_created: string
}

import { Container, TextField, Button, Typography, Paper, Box } from "@mui/material";
import { AuthContext } from "../contexts/AuthContext";

const Chat: React.FC = () => {
    const { groupId } = useParams<{ groupId: string }>();
    const { user } = useContext(AuthContext)
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [socket, setSocket] = useState<any>(null);

    useEffect(() => {
        console.log(groupId);
        if (!groupId) return;

        const newSocket = connectSocket();
        setSocket(newSocket);

        joinChatRoom(groupId);

        newSocket.on("message", (msg: ChatMessage) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [groupId]);

    const handleSendMessage = () => {
        if (!message.trim() || !groupId || !socket || user?.full_name === undefined) return;
    

        const time_created = new Date().toISOString();
    
        sendMessage(groupId, message, user.full_name, time_created)
        //setMessages((prev) => [...prev, {groupId, content: message, username: user.full_name, time_created}]);
        setMessage("");
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
                    Chat Room {groupId}
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
                                <strong>{msg.username}:</strong> {msg.content}
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
