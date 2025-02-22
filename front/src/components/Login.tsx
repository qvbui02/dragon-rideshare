/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import { AuthContext } from "../contexts/AuthContext";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsAuthenticated, setUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showResend, setShowResend] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get("verified") === "true") {
      setSuccess("Your email has been successfully verified! You can now log in.");
    }
  }, [location.search]);

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
    setShowResend(false);
    setResendMessage("");

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
    } catch (err: any) {
      if (err.response && err.response.data?.error) {
        if (err.response.status === 403 && err.response.data.error.includes("verify your email")) {
          setError("Please verify your email before logging in.");
          setShowResend(true); // Show Resend Verification button
        } else {
          setError(err.response.data.error);
        }
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  const resendVerificationEmail = async () => {
    setIsResending(true);
    setResendMessage("");

    try {
      const response = await axios.post("/resend-verification", { email: formData.email });
      if (response.status === 200) {
        setResendMessage("Verification email resent! Check your inbox.");
      }
    } catch (err: any) {
      console.log(err);
      setResendMessage("Failed to resend verification email.");
    } finally {
      setIsResending(false);
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

      {success && <Alert severity="success">{success}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      {resendMessage && <Alert severity="info">{resendMessage}</Alert>}

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

      {/* ✅ Conditionally show the Resend Verification button */}
      {showResend && (
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={resendVerificationEmail}
          disabled={isResending}
        >
          {isResending ? "Resending..." : "Resend Verification Email"}
        </Button>
      )}

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