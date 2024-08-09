"use client";

import React, { useState } from "react";
import { auth, firestore } from "../api/firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography } from '@mui/material';

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isStrongPassword(password)) {
      setError(
        "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character"
      );
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(firestore, "users", userCredential.user.uid), {
        username,
        email,
      });
      navigate("/chatbot");
    } catch (error) {
      setError(error.message);
    }
  };

  const isStrongPassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasNonalphas = /\W/.test(password);
    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasNonalphas
    );
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
        Signup
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
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          fullWidth
        />

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
          Signup
        </Button>

        <Typography sx={{ mt: 2 }}>
          Already have an account? <Link href="/login" underline="hover">Login</Link>
        </Typography>
      </Box>
    </Box>
  );
}

export default Signup;



// <Typography variant="h4" gutterBottom>
//   Signup
// </Typography>
// <TextField label="Name" variant="outlined" fullWidth />
// <TextField label="Email" variant="outlined" fullWidth />
// <TextField label="Password" type="password" variant="outlined" fullWidth />

