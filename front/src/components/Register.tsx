/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Box, TextField, Button, Typography } from "@mui/material";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    phone_number: "",
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
      const response = await axios.post("/api/auth/register", formData);

      // If successful, redirect to /login
      if (response.status === 201) {
        setSuccess("User registered successfully! Redirecting to login...");
        // Briefly show success message before redirect
        navigate("/login")
      }
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
        margin: "0 auto", // center horizontally
      }}
    >
      <Typography variant="h5" textAlign="center" sx={{ mb: 2 }}>
        Register
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
        label="Full Name"
        name="full_name"
        value={formData.full_name}
        onChange={handleChange}
        required
      />
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
      <TextField
        label="Phone Number"
        name="phone_number"
        value={formData.phone_number}
        onChange={handleChange}
      />
      <Button variant="contained" type="submit" sx={{ mt: 2 }}>
        Register
      </Button>

      <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
        Already have an account?{" "}
        <Link to="/login" style={{ textDecoration: "none", color: "#1976d2" }}>
          Log in
        </Link>
      </Typography>
    </Box>
  );
};

export default Register;
