"use client";

import React, { useState } from "react";
import { auth } from "../api/firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography } from '@mui/material';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/chatbot");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: '100vh', // Ensure it takes at least the full height of the viewport
        bgcolor: 'background.paper',
        padding: 3
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ color: '#424242' }}>
        Login
      </Typography>
  
      {error && <Typography color="error">{error}</Typography>}
  
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%', // Adjusts the width
          maxWidth: 360, // Limits the maximum width
          display: 'flex',
          flexDirection: 'column',
          gap: 2, // Provides consistent spacing between elements
        }}
      >
        
  
        <TextField
          label="Email"
          variant="outlined"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
        />
  
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
        />
  
        <Button
          type="submit"
          variant="contained"
          sx={{ bgcolor: 'secondary.main', color: 'white' }}
        >
          Login
        </Button>
  
        <Typography sx={{ mt: 2 }}>
          Already have an account? <Link href="/login" underline="hover">Login</Link>
        </Typography>
      </Box>
    </Box>
  );
}

export default Login;


