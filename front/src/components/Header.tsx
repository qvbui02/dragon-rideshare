import React, { useContext, useEffect, useState } from "react";
import { AppBar, Toolbar, Box, Button, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, setIsAuthenticated, setUser } = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          const response = await axios.get("/api/auth/me", { withCredentials: true });
          setIsAdmin(response.data.is_admin || false);
        } catch (error) {
          console.error("Error checking admin status:", error);
        }
      }
    };

    checkAdminStatus();
  }, [user]);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      setIsAuthenticated(false);
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{ color: "white", textDecoration: "none", fontWeight: "bold" }}
          >
            Rideshare
          </Typography>
        </Box>

        {isAuthenticated ? (
          <>
            {user && (
              <Typography
                variant="body1"
                sx={{ marginRight: 2, color: "white" }}
              >
                {user.full_name}
              </Typography>
            )}
            <Button color="inherit" component={Link} to="/chatgroup">
              Inbox
            </Button>

            {isAdmin && (
              <Button color="inherit" component={Link} to="/admin">
                Admin Panel
              </Button>
            )}

            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;