import React from "react";
import { TextField, Button, Container, Box, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const API_base_url = import.meta.env.REACT_APP_API_URL || "http://localhost:5001";
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    try {
      const res = await axios.post(`$(API_base_url)/api/login`, {
        email: data.get("email"),
        password: data.get("password")
      });

      login(res.data.token, res.data.role); // store in context
      navigate("/products");

    } catch (err) {
      console.error("Login error:", err);
      alert("Invalid credentials");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h5">Sign In</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField fullWidth name="email" label="Email" sx={{ mb: 2 }} />
          <TextField fullWidth name="password" type="password" label="Password" sx={{ mb: 2 }} />
          <Button type="submit" fullWidth variant="contained">Login</Button>
        </Box>
      </Box>
    </Container>
  );
}