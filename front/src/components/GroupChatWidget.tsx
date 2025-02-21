import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Button, CircularProgress, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Group {
    trip_id: number;
    members: number;
    lastMessage: string;
}

const GroupChatWidgets: React.FC = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.get("/api/chat/groups", { withCredentials: true });
                setGroups(response.data.group_chats);
            } catch (error: any) {
                console.error("Error fetching groups:", error);
                if (error.response) {
                    console.error("Server Response:", error.response.status, error.response.data);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

    const handleJoinChat = (groupId: number) => {
        navigate(`/chat/${groupId}`);
    };

    return (
        <Paper elevation={3} sx={{ padding: 3, maxWidth: 600, margin: "auto", marginTop: 4 }}>
            <Typography variant="h5" align="center" gutterBottom>
                My Group Chats
            </Typography>

            {loading ? (
                <CircularProgress sx={{ display: "block", margin: "auto" }} />
            ) : (
                <Grid container spacing={2}>
                    {groups.length > 0 ? (
                        groups.map((group) => (
                            <Grid item xs={12} key={group.trip_id}>
                                <Card sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 2 }}>
                                    <CardContent>
                                        <Typography variant="h6">Trip #{group.trip_id}</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {group.members} members
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" sx={{ fontStyle: "italic" }}>
                                            Last message: {group.lastMessage || "No messages yet"}
                                        </Typography>
                                    </CardContent>
                                    <Button variant="contained" color="primary" onClick={() => handleJoinChat(group.trip_id)}>
                                        Join Chat
                                    </Button>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Typography align="center" color="textSecondary">
                            No group chats found.
                        </Typography>
                    )}
                </Grid>
            )}
        </Paper>
    );
};

export default GroupChatWidgets;
