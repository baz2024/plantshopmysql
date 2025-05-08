import React from "react";
import { TextField, Button, Container, Box, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signin() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const res = await axios.post("http://localhost:5001/api/login", {
      email: data.get("email"),
      password: data.get("password")
    });
    localStorage.setItem("token", res.data.token);
    navigate("/products");
  };

  // Example: Add a "Forgot Password?" button
  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h5">Sign In</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField fullWidth name="email" label="Email" sx={{ mb: 2 }} />
          <TextField fullWidth name="password" type="password" label="Password" sx={{ mb: 2 }} />
          <Button type="submit" fullWidth variant="contained">Login</Button>
          <Button 
            fullWidth 
            variant="outlined" 
            sx={{ mt: 1 }} 
            onClick={handleForgotPassword}
          >
            Forgot Password?
          </Button>
        </Box>
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2">
            Don't have an account?{" "}
            <a href="/signup" style={{ textDecoration: "none", color: "#1976d2" }}>
              Sign up
            </a>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}