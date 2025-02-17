import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Box, TextField, Button, Typography } from "@mui/material";
import { AuthContext } from "../contexts/AuthContext";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, setUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    try {
      const response = await axios.post("/api/auth/login", formData);
      if (response.status === 200) {
        setSuccess("Login successful!");

        // Immediately call /api/auth/me to update global auth state
        axios.get("/api/auth/me").then((res) => {
          if (res.status === 200) {
            setIsAuthenticated(true);
            setUser(res.data); // Store the user details from /me
          }
          navigate("/");
        });
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response && err.response.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong. Please try again.");
      }
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
        maxWidth: 400,
        margin: "0 auto",
      }}
    >
      <Typography variant="h5" textAlign="center" sx={{ mb: 2 }}>
        Login
      </Typography>

      {error && (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      )}
      {success && (
        <Typography variant="body1" color="primary">
          {success}
        </Typography>
      )}

      <TextField
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <Button variant="contained" type="submit" sx={{ mt: 2 }}>
        Login
      </Button>

      <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
        Don&apos;t have an account?{" "}
        <Link to="/register" style={{ textDecoration: "none", color: "#1976d2" }}>
          Register
        </Link>
      </Typography>
    </Box>
  );
};

export default Login;