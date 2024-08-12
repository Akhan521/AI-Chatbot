"use client";

import React, { useState } from "react";
import { auth } from "../api/firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography } from '@mui/material';
import { motion } from "framer-motion";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/chatbot");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <motion.div
    //using clip path, animate the exit of the login page
    initial={{ clipPath: "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)" }}
    animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" }}
    transition={{ duration: 0.5 }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{
          minHeight: '100vh', // Ensure it takes at least the full height of the viewport
          //set background color to white
          backgroundColor: '#4A148C', // Dark background color
          color: 'white', // Text color to white
          padding: 3
        }}
      >
        <Typography variant="h2" gutterBottom>
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
            autoComplete='off'
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            sx={textfieldStyle}
          />

          <TextField
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            autoComplete='off'
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            sx={textfieldStyle}
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
            Login
          </Button>
        </Box>
    
        <Box
          display="flex"
          justifyContent="center"
          width="100%"
        >
          <Typography
          sx={{ mt: 2, color: 'white' }}
          >
            Don't have an account?{" "}
            <Link
              style={linkStyle}
              to="/signup"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              >Sign Up
            </Link>
          </Typography>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}

export default Login;


