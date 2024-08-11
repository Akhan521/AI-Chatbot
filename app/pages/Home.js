import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4A148C', // Dark background color
        overflow: 'hidden', // Hide the scroll bar to avoid animation shifts
        color: 'white', // Text color to white
        animation: 'fadeSlideIn 1s ease-out forwards',
        '@keyframes fadeSlideIn': {
          '0%': {
            opacity: 0,
            transform: 'translateY(20px)'
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0)'
          }
        }
        
      }}
    >
      <Typography variant="h2" gutterBottom sx={{ 
        //fontFamily: 'Arial',
        fontWeight: 'bold', animation: 'fadeSlideIn 1.2s ease-out forwards',
        '@keyframes fadeSlideIn': {
          '0%': {
            opacity: 0,
            transform: 'translateY(20px)'
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0)'
          }
        }}}>
        Welcome to Our App
      </Typography>
      <Button
        component={Link}
        to="/login"
        variant="contained"
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          width: '150px',
          mb: 2,
          ':hover': {
            bgcolor: '#673ab7', // Darker shade for hover on login
          }
        }}
      >
        Login
      </Button>
      <Button
        component={Link}
        to="/signup"
        variant="contained"
        sx={{
          bgcolor: 'secondary.main',
          color: 'white',
          width: '150px',
          ':hover': {
            bgcolor: '#c2185b', // Darker shade for hover on signup
          }
        }}
      >
        Sign up
      </Button>
    </Box>
  );
}

export default Home;
