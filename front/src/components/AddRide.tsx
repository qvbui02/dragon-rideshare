import React, { useState, useContext } from "react";
import axios from "axios";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import { AuthContext } from "../contexts/AuthContext";

const AddRide: React.FC = () => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    source_radius: "",
    destination_radius: "",
    mode_of_transport: "",
    departure_time: "",
    departure_date: "",
    max_passengers: "",
    hours: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user || !user.user_id) {
      setError("User not authenticated. Please log in first.");
      return;
    }

    try {
      const response = await axios.post(
        "/api/addride",
        { ...formData, userId: user.user_id }
      );

      if (response.status === 201) {
        setSuccess("Ride added successfully!");
      } else {
        setError("Failed to add ride. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      setError("An error occurred while adding the ride.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
        maxWidth: 600,
        margin: "0 auto",
      }}
    >
      <Typography variant="h5" textAlign="center" sx={{ mb: 2 }}>
        Add a Ride
      </Typography>

      {success && <Alert severity="success">{success}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="Source"
        name="source"
        value={formData.source}
        onChange={handleChange}
        required
      />
      <TextField
        label="Destination"
        name="destination"
        value={formData.destination}
        onChange={handleChange}
        required
      />
      <TextField
        label="Source Radius"
        name="source_radius"
        value={formData.source_radius}
        onChange={handleChange}
      />
      <TextField
        label="Destination Radius"
        name="destination_radius"
        value={formData.destination_radius}
        onChange={handleChange}
      />
      <TextField
        label="Mode of Transport"
        name="mode_of_transport"
        value={formData.mode_of_transport}
        onChange={handleChange}
        required
      />
      <TextField
        label="Departure Time"
        name="departure_time"
        type="time"
        value={formData.departure_time}
        onChange={handleChange}
        required
      />
      <TextField
        label="Departure Date"
        name="departure_date"
        type="date"
        value={formData.departure_date}
        onChange={handleChange}
        required
      />
      <TextField
        label="Max Passengers"
        name="max_passengers"
        type="number"
        value={formData.max_passengers}
        onChange={handleChange}
      />
      <TextField
        label="Hours"
        name="hours"
        type="number"
        value={formData.hours}
        onChange={handleChange}
      />

      <Button variant="contained" type="submit" sx={{ mt: 2 }}>
        Add Ride
      </Button>
    </Box>
  );
};

export default AddRide;
