import { Outlet } from "react-router-dom";
import { Container, Box } from "@mui/material";
import Header from "../components/Header";

const Layout: React.FC = () => (
  <Container maxWidth="lg">
    <Header />
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
      <Outlet />
    </Box>
  </Container>
);

export default Layout;