import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box, Paper } from "@mui/material";
import axios from "axios";

interface TripDetailsProps {
  trip_id: number;
  source: string;
  destination: string;
  departure_time: string;
  departure_date: string;
  created_at: string;
}

const TripDetails: React.FC = () => {
  const { trip_id } = useParams<{ trip_id: string }>();
  const [trip, setTrip] = useState<TripDetailsProps | null>(null);

  useEffect(() => {
    if (!trip_id) return;

    const fetchTripDetails = async () => {
      try {
        const response = await axios.get(`/api/trip/details/${trip_id}`, { withCredentials: true });
        console.log("Fetched Trip Details:", response.data);

        setTrip(response.data.trip_details); // Store trip details in state
      } catch (err) {
        console.error("Error fetching trip details:", err);
      }
    };

    fetchTripDetails();
  }, [trip_id]);

  if (!trip) {
    return (
      <Box sx={{ maxWidth: "100%", margin: "auto", padding: 3 }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          Loading trip details...
        </Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ maxWidth: "600px", margin: "auto", padding: 3, mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Trip Details
      </Typography>
      <Box>
        <Typography variant="body1">
          <strong>Source:</strong> {trip.source}
        </Typography>
        <Typography variant="body1">
          <strong>Destination:</strong> {trip.destination}
        </Typography>
        <Typography variant="body1">
          <strong>Departure Date:</strong> {trip.departure_date}
        </Typography>
        <Typography variant="body1">
          <strong>Departure Time:</strong> {trip.departure_time}
        </Typography>
        <Typography variant="body1">
          <strong>Created At:</strong> {trip.created_at}
        </Typography>
      </Box>
    </Paper>
  );
};

export default TripDetails;
