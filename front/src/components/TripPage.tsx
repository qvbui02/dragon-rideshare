import React from "react";
import { Box, Container } from "@mui/material";
import Chat from "./Chat";
import TripDetails from "./TripDetails";

const TripPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box 
        sx={{ 
          display: "flex", 
          gap: 3, 
          height: "80vh", 
          marginTop: 4, 
          alignItems: "flex-start"
        }}
      >
        <Box sx={{ flex: 2 }}>
          <TripDetails />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Chat />
        </Box>
      </Box>
    </Container>
  );
};

export default TripPage;
