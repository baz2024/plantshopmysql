import React from "react";
import { TextField, Button, Container, Box, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    await axios.post("http://localhost:5001/api/register", {
      email: data.get("email"),
      password: data.get("password")
    });
    navigate("/signin");
  };

  const handleGoToSignin = () => {
    navigate("/signin");
  };
  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h5">Sign Up</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField fullWidth name="email" label="Email" sx={{ mb: 2 }} />
          <TextField fullWidth name="password" type="password" label="Password" sx={{ mb: 2 }} />
          <Button type="submit" fullWidth variant="contained">Register</Button>
          <Button 
            fullWidth 
            variant="outlined" 
            sx={{ mt: 1 }} 
            onClick={handleGoToSignin}
          >
            Already have an account? Sign In
          </Button> 
        </Box>
      </Box>
    </Container>
  );
}