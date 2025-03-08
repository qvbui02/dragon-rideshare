import React, { useState, useContext } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Card,
  CardContent,
  Grid,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { AuthContext } from "../contexts/AuthContext";
import PlaceIcon from "@mui/icons-material/Place";
import DateRangeIcon from "@mui/icons-material/DateRange";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";

const AddRide: React.FC = () => {
  const { user } = useContext(AuthContext);

  const today = new Date().toISOString().split("T")[0];
  const currentTime = new Date().toTimeString().split(" ")[0].slice(0, 5);

  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    source_radius: "",
    destination_radius: "",
    mode_of_transport: "",
    departure_time: currentTime,
    departure_date: today,
    max_passengers: "1",
    hours: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "max_passengers") {
      const numValue = parseInt(value);
      if (numValue < 1) {
        setFormData({ ...formData, [name]: "1" });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
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
      const response = await axios.post("/api/addride", {
        ...formData,
        userId: user.user_id,
      });

      if (response.status === 201) {
        setSuccess("Ride added successfully!");
        setFormData({ // Reset form after success
          source: "",
          destination: "",
          source_radius: "",
          destination_radius: "",
          mode_of_transport: "",
          departure_time: currentTime,
          departure_date: today,
          max_passengers: "1",
          hours: "",
        });
      } else {
        setError("Failed to add ride. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.error) {
        setError(err.response.data.error); // Display "Geocoding failed for address..." or other errors
      } else {
        setError("An error occurred while adding the ride.");
      }
    }
  };

  return (
    <Card sx={{ maxWidth: 600, mx: "auto", mt: 4, boxShadow: 5, borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h5" textAlign="center" sx={{ mb: 3, fontWeight: "bold" }}>
          Create My Shared Trip
        </Typography>

        {success && <Alert severity="success">{success}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Source"
                name="source"
                value={formData.source}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PlaceIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Destination"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PlaceIcon color="secondary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Source Radius" name="source_radius" value={formData.source_radius} onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Destination Radius" name="destination_radius" value={formData.destination_radius} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Mode of Transport"
                name="mode_of_transport"
                value={formData.mode_of_transport}
                onChange={handleChange}
                required
              >
                <MenuItem value="Car">Car</MenuItem>
                <MenuItem value="Taxi">Taxi</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Departure Time"
                name="departure_time"
                type="time"
                value={formData.departure_time}
                onChange={handleChange}
                required
                inputProps={{ min: currentTime }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTimeIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Departure Date"
                name="departure_date"
                type="date"
                value={formData.departure_date}
                onChange={handleChange}
                required
                inputProps={{ min: today }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DateRangeIcon color="disabled" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Max Passengers"
                name="max_passengers"
                type="number"
                value={formData.max_passengers}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PeopleIcon color="error" />
                    </InputAdornment>
                  ),
                  inputProps: { min: 1 },
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Hours" name="hours" type="number" value={formData.hours} onChange={handleChange} />
            </Grid>
          </Grid>
          <Button variant="contained" type="submit" sx={{ mt: 2, fontWeight: "bold" }}>
            Add Ride
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AddRide;