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
  const [hover, setHover] = useState(false);

  const linkStyle = {
    color: hover ? '#CDB1FF' : 'white',
  };

  const textfieldStyle = {
    '& label': {
      color: '#9A9498',
    },
    '&:hover label': {
      color: 'white', // Sets the label color to white on hover
    },
    '& .MuiInputBase-input': {
      color: 'white', // Sets the text color inside the input field to white
    },
    '& label.Mui-focused': {
      color: 'white',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#9A9498',
      },
      '&:hover fieldset': {
        borderColor: 'white',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#9A9498',
      },
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isStrongPassword(password)) {
      setError(
        "Password must be at least 8 characters long, contain an uppercase, a lowercase, a number, and a special character."
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
        bgcolor: '#4A148C',
        padding: 3
      }}
    >
      <Typography variant="h2" gutterBottom sx={{ color: 'white' }}>
        Sign up
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
          sx={textfieldStyle}
          onChange={(e) => setUsername(e.target.value)}
          required
          fullWidth
        />

        <TextField
          label="Email"
          variant="outlined"
          type="email"
          value={email}
          sx={textfieldStyle}
          onChange={(e) => setEmail(e.target.value)}
          required
          FullWidth
        />

        <TextField
          label="Password"
          variant="outlined"
          type="password"
          value={password}
          sx={textfieldStyle}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
        />



<Box
        display="flex"
        justifyContent="center" // Centers the button horizontally
        width="100%" // Ensures the container spans the full width
      >
        <Button
          type="submit"
          variant="contained"
          sx={{  bgcolor: 'secondary.main',
            color: 'white',
            width: 120, // Setting a fixed width
            px: 2, // Horizontal padding
            py: 1 }}
        >
          Sign Up
        </Button>
      </Box>

      <Box
        display="flex"
        justifyContent="center"
        width="100%"
      >
        <Typography sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Link 
            style={linkStyle}
            to="/login"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            >Login</Link>
        </Typography>
        </Box>
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

