import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Container, Grid, Card, CardContent, Typography, Button, TextField, MenuItem, 
  Select, InputLabel, FormControl, SelectChangeEvent, CircularProgress, Box, Paper 
} from "@mui/material";

const Rides: React.FC = () => {
  const [rides, setRides] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState({
    source: "",
    destination: "",
    mode_of_transport: "",
    departure_date: "",
    max_passengers: "",
    search: "",
  });
  const [sort, setSort] = useState({ sort_by: "departure_time", sort_order: "ASC" });

  useEffect(() => {
    fetchRides();
  }, [filters, sort]);

  const fetchRides = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/rides", {
        params: {
          source: filters.source,
          destination: filters.destination,
          mode_of_transport: filters.mode_of_transport,
          departure_date: filters.departure_date,
          max_passengers: filters.max_passengers,
          sort_by: sort.sort_by,
          sort_order: sort.sort_order,
          search: filters.search,
        },
      });
      setRides(response.data.rides);
    } catch (err) {
      setError("Error fetching trips");
      console.error(err);
    }
    setLoading(false);
  };

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
      fetchRides();
    } catch (error: any) {
      console.error("Join trip error:", error.response?.data || error);
      alert(error.response?.data?.error || "Error joining trip");
    } finally {
      setJoining(null);
    }
  };

  const handleFilterChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleModeFilterChange = (event: SelectChangeEvent<string>) => {
    setFilters((prev) => ({
      ...prev,
      mode_of_transport: event.target.value,
    }));
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    const [sort_by, sort_order] = event.target.value.split("_");
    setSort({ sort_by, sort_order });
  };

  const getAvailabilityColor = (availableSeats: number, maxPassengers: number) => {
    const ratio = availableSeats / maxPassengers;
    if (ratio > 0.5) return "success";
    if (ratio > 0.2) return "warning";
    return "error";
  };

  return (
    <Container sx={{ margin: "auto", py: 5 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 4, backgroundColor: "#f9f9f9" }}>
        <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
          Find Your Trip
        </Typography>
        {error && <Typography color="error" align="center">{error}</Typography>}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Source"
              fullWidth
              value={filters.source}
              onChange={handleFilterChange("source")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Destination"
              fullWidth
              value={filters.destination}
              onChange={handleFilterChange("destination")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Mode</InputLabel>
              <Select value={filters.mode_of_transport} onChange={handleModeFilterChange}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Car">Car</MenuItem>
                <MenuItem value="Taxi">Taxi</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Departure Date"
              type="date"
              fullWidth
              value={filters.departure_date}
              onChange={handleFilterChange("departure_date")}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Min Passengers"
              type="number"
              fullWidth
              value={filters.max_passengers}
              onChange={handleFilterChange("max_passengers")}
              inputProps={{ min: 1 }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Search Locations"
              fullWidth
              value={filters.search}
              onChange={handleFilterChange("search")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select value={`${sort.sort_by}_${sort.sort_order}`} onChange={handleSortChange}>
                <MenuItem value="departure_time_ASC">Departure Time (Earliest)</MenuItem>
                <MenuItem value="departure_time_DESC">Departure Time (Latest)</MenuItem>
                <MenuItem value="hours_ASC">Duration (Shortest)</MenuItem>
                <MenuItem value="hours_DESC">Duration (Longest)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      ) : rides.length > 0 ? (
        <Grid container spacing={3}>
          {rides.map((ride) => (
            <Grid item xs={12} sm={6} md={4} key={ride.trip_id}>
              <Card 
                sx={{ 
                  p: 2, 
                  boxShadow: 3, 
                  transition: "0.3s", 
                  "&:hover": { boxShadow: 6, transform: "scale(1.02)" } 
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Trip #{ride.trip_id}
                  </Typography>
                  <Typography><strong>From:</strong> {ride.source}</Typography>
                  <Typography><strong>To:</strong> {ride.destination}</Typography>
                  <Typography><strong>Mode:</strong> {ride.mode_of_transport}</Typography>
                  <Typography><strong>Departure:</strong> {new Date(ride.departure_date).toLocaleString()}</Typography>
                  <Typography><strong>Max Passengers:</strong> {ride.max_passengers}</Typography>
                  <Typography><strong>Hours:</strong> {ride.hours}</Typography>
                  <Typography color={getAvailabilityColor(ride.available_seats, ride.max_passengers)}>
                    Available Seats: {ride.available_seats}/{ride.max_passengers}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => handleJoinTrip(ride.trip_id)}
                    disabled={joining === ride.trip_id}
                  >
                    {joining === ride.trip_id ? "Joining..." : "Join Ride"}
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
