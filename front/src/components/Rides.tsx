import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Grid, Card, CardContent, Typography, Button } from "@mui/material";

const Rides: React.FC = () => {
    const [rides, setRides] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [joining, setJoining] = useState<number | null>(null);

    useEffect(() => {
        const fetchRides = async () => {
            try {
                const response = await axios.get("/api/rides");
                setRides(response.data.rides);
            } catch (err) {
                setError("Error fetching trips");
                console.error(err);
            }
        };

        fetchRides();
    }, []);

    const handleJoinTrip = async (tripId: number) => {
        console.log("Joining trip with ID:", tripId);
        setJoining(tripId);
        try {
            const response = await axios.post(
                "/api/rides/join-trip",
                { trip_id: tripId },
                { withCredentials: true }
            );
            console.log("Join trip response:", response.data);
            alert(response.data.message);
        } catch (error: any) {
            console.error("Join trip error:", error.response?.data || error);
            alert(error.response?.data?.error || "Error joining trip");
        } finally {
            setJoining(null);
        }
    };
    

    return (
        <Container sx={{mt: 30, py: 20 }}>
            {error && <Typography color="error" align="center">{error}</Typography>}
            {rides.length > 0 ? (
                <Grid container spacing={3}>
                    {rides.map((ride, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card sx={{ p: 2, boxShadow: 3, transition: "0.3s", "&:hover": { boxShadow: 6 } }}>
                                <CardContent>
                                    <Typography variant="h5" gutterBottom>
                                        Trip {index + 1}
                                    </Typography>
                                    <Typography><strong>Created by:</strong> {ride.created_by_name}</Typography>
                                    <Typography><strong>From:</strong> {ride.source} <strong>To:</strong> {ride.destination}</Typography>
                                    <Typography><strong>Mode of transport:</strong> {ride.mode_of_transport}</Typography>
                                    <Typography><strong>Departure:</strong> {new Date(ride.departure_date).toLocaleString()}</Typography>
                                    <Typography><strong>Max passengers:</strong> {ride.max_passengers}</Typography>
                                    <Typography><strong>Hours:</strong> {ride.hours}</Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        onClick={() => {
                                            handleJoinTrip(index+1);
                                        }}
                                        disabled={joining === index+1}
                                        sx={{ mt: 2 }}
                                    >
                                        {joining === index+1 ? "Joining..." : "Join"}
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography align="center" color="textSecondary">
                    No trips available
                </Typography>
            )}
        </Container>
    );
};

export default Rides;
