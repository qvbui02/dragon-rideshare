import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box, Paper } from "@mui/material";
import axios from "axios";
import { APIProvider, Map, AdvancedMarker, InfoWindow, Pin } from "@vis.gl/react-google-maps";

interface TripDetailsProps {
  trip_id: number;
  source: string;
  destination: string;
  departure_time: string;
  departure_date: string;
  created_at: string;
  source_latitude: number;
  source_longitude: number;
  destination_latitude: number;
  destination_longitude: number;
}

const TripDetails: React.FC = () => {
  const { trip_id } = useParams<{ trip_id: string }>();
  const [trip, setTrip] = useState<TripDetailsProps | null>(null);
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState<string | null>(null);
  const [openSourceInfo, setOpenSourceInfo] = useState(false);
  const [openDestinationInfo, setOpenDestinationInfo] = useState(false);
  const MAP_ID = "8c90d3b7dbe6f116";

  useEffect(() => {
    if (!trip_id) return;

    const fetchTripDetails = async () => {
      try {
        const response = await axios.get(`/api/trip/details/${trip_id}`, { withCredentials: true });
        setTrip(response.data.trip_details);
      } catch (err) {
        console.error("Error fetching trip details:", err);
      }
    };

    const fetchGoogleMapsApiKey = async () => {
      try {
        const response = await axios.get("/api/config/google-maps-key");
        setGoogleMapsApiKey(response.data.apiKey);
      } catch (err) {
        console.error("Error fetching Google Maps API key:", err);
      }
    };

    fetchTripDetails();
    fetchGoogleMapsApiKey();
  }, [trip_id]);

  if (!trip) {
    return (
      <Box sx={{ maxWidth: "100%", margin: "auto", padding: 5 }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          Loading trip details...
        </Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ maxWidth: "800px", minHeight:"900px", padding: 3, marginTop: 4 }}>
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

      <Box sx={{ width: "100%", height: "700px", marginTop: 3, borderRadius: 3, overflow: "hidden" }}>
        <APIProvider apiKey={googleMapsApiKey || ""}>
          <Map
            style={{ width: "100%", height: "100%" }}
            defaultCenter={{ 
              lat: (trip.source_latitude + trip.destination_latitude) / 2, 
              lng: (trip.source_longitude + trip.destination_longitude) / 2 
            }}
            defaultZoom={12}
            mapId={MAP_ID}
            gestureHandling="greedy"
            disableDefaultUI={true}
          >
            <AdvancedMarker 
              position={{ lat: trip.source_latitude, lng: trip.source_longitude }} 
              onClick={() => setOpenSourceInfo(true)}
            >
              <Pin background={"blue"} borderColor={"white"} glyphColor={"white"} />
            </AdvancedMarker>
            {openSourceInfo && (
              <InfoWindow 
                position={{ lat: trip.source_latitude, lng: trip.source_longitude }} 
                onCloseClick={() => setOpenSourceInfo(false)}
              >
                <Typography variant="body2"><strong>Source:</strong> {trip.source}</Typography>
              </InfoWindow>
            )}

            <AdvancedMarker 
              position={{ lat: trip.destination_latitude, lng: trip.destination_longitude }} 
              onClick={() => setOpenDestinationInfo(true)}
            >
              <Pin background={"red"} borderColor={"white"} glyphColor={"white"} />
            </AdvancedMarker>
            {openDestinationInfo && (
              <InfoWindow 
                position={{ lat: trip.destination_latitude, lng: trip.destination_longitude }} 
                onCloseClick={() => setOpenDestinationInfo(false)}
              >
                <Typography variant="body2"><strong>Destination:</strong> {trip.destination}</Typography>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </Box>
    </Paper>
  );
};

export default TripDetails;
