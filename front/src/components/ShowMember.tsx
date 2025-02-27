import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Box, Card, CardContent, Typography, CircularProgress, Alert, Rating, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle
} from "@mui/material";

interface TripMember {
  trip_id: number;
  other_member_id: number;
  full_name: string;
  email: string;
  phone_number: string;
  joined_at?: string;
}

const ShowMember: React.FC = () => {
  const [tripMembers, setTripMembers] = useState<{ [trip_id: number]: TripMember[] }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<{ trip_id: number; user_id: number } | null>(null);
  const [ratings, setRatings] = useState<{ [trip_id: number]: { [user_id: number]: number } }>({});
  const [feedbacks, setFeedbacks] = useState<{ [trip_id: number]: { [user_id: number]: string } }>({});
  const [ratedUsers, setRatedUsers] = useState<{ [trip_id: number]: { [user_id: number]: boolean } }>({});

  useEffect(() => {
    const fetchTripMembers = async () => {
      try {
        const response = await axios.get(`/api/trip/members`, { withCredentials: true });

        if (response.data && response.data.members) {
          const groupedTrips: { [trip_id: number]: TripMember[] } = {};
          response.data.members.forEach((member: TripMember) => {
            if (!groupedTrips[member.trip_id]) {
              groupedTrips[member.trip_id] = [];
            }
            groupedTrips[member.trip_id].push(member);
          });

          setTripMembers(groupedTrips);
        } else {
          setTripMembers({});
        }
      } catch (err) {
        setError("Failed to fetch members on the same trip.");
      } finally {
        setLoading(false);
      }
    };

    fetchTripMembers();
  }, []);

  const handleOpenRatingDialog = (trip_id: number, user_id: number) => {
    setSelectedUser({ trip_id, user_id });
  };

  const handleCloseRatingDialog = () => {
    setSelectedUser(null);
  };

  const handleRatingSubmit = async () => {
    if (!selectedUser) return;

    const { trip_id, user_id } = selectedUser;
    try {
      await axios.post(
        `/api/rating`,
        { rated_user: user_id, trip_id, rating: ratings[trip_id]?.[user_id] || 0, feedback: feedbacks[trip_id]?.[user_id] || "" },
        { withCredentials: true }
      );

      setRatedUsers((prev) => ({
        ...prev,
        [trip_id]: { ...prev[trip_id], [user_id]: true },
      }));

      handleCloseRatingDialog();
    } catch (err) {
      console.error("Failed to submit rating:", err);
    }
  };

  return (
    <Box sx={{ maxWidth: "100%", margin: "auto", padding: 3 }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        People You've Traveled With
      </Typography>

      {loading && <CircularProgress sx={{ display: "block", margin: "20px auto" }} />}
      {error && <Alert severity="error">{error}</Alert>}

      {Object.keys(tripMembers).length > 0 ? (
        Object.entries(tripMembers).map(([trip_id, members]) => (
          <Card key={trip_id} sx={{ marginBottom: 3, maxWidth: 800, marginX: "auto", padding: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" color="primary">
                Trip ID: {trip_id}
              </Typography>
              {members.map((member) => (
                <Box key={member.other_member_id} sx={{ display: "flex", flexDirection: "column", mb: 2, p: 2, borderRadius: 2, backgroundColor: "#f9f9f9", boxShadow: 1 }}>
                  <Box>
                    <Typography variant="body1">
                      <strong>Name:</strong> {member.full_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Email:</strong> {member.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Phone:</strong> {member.phone_number || "N/A"}
                    </Typography>
                    {member.joined_at && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>Joined At:</strong> {new Date(member.joined_at).toLocaleString()}
                      </Typography>
                    )}
                  </Box>

                  {/* Button to Rate */}
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleOpenRatingDialog(Number(trip_id), member.other_member_id)}
                    sx={{ mt: 1, alignSelf: "flex-start" }}
                  >
                    Click Here to Rate
                  </Button>
                </Box>
              ))}
            </CardContent>
          </Card>
        ))
      ) : (
        !loading && <Alert severity="info">No other members found.</Alert>
      )}

      {/* Rating Dialog */}
      <Dialog open={Boolean(selectedUser)} onClose={handleCloseRatingDialog}>
        <DialogTitle>Rate This Person</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Rating
            value={selectedUser ? ratings[selectedUser.trip_id]?.[selectedUser.user_id] || 0 : 0}
            onChange={(_, newValue) => {
              if (selectedUser && newValue !== null) {
                setRatings((prev) => ({
                  ...prev,
                  [selectedUser.trip_id]: {
                    ...(prev[selectedUser.trip_id] || {}),
                    [selectedUser.user_id]: newValue,
                  },
                }));
              }
            }}
            disabled={selectedUser ? ratedUsers[selectedUser.trip_id]?.[selectedUser.user_id] : false}
          />

          <TextField
            label="Feedback (Optional)"
            variant="outlined"
            size="small"
            multiline
            rows={2}
            value={selectedUser ? feedbacks[selectedUser.trip_id]?.[selectedUser.user_id] || "" : ""}
            onChange={(e) => {
              if (selectedUser) {
                setFeedbacks((prev) => ({
                  ...prev,
                  [selectedUser.trip_id]: {
                    ...(prev[selectedUser.trip_id] || {}),
                    [selectedUser.user_id]: e.target.value,
                  },
                }));
              }
            }}
            disabled={selectedUser ? ratedUsers[selectedUser.trip_id]?.[selectedUser.user_id] : false}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRatingDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleRatingSubmit}
            color="primary"
            variant="contained"
            disabled={selectedUser ? ratedUsers[selectedUser.trip_id]?.[selectedUser.user_id] : false}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShowMember;
