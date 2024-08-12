"use client";

import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import ReactStars from 'react-stars';
import { motion, AnimatePresence } from 'framer-motion';

function Feedback() {

    const ratingChanged = (newRating) => {
        console.log(newRating)
    }

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

    return (
        <AnimatePresence
        >
        <motion.div
            // Using clip path, animate the exit of the login page
            initial={{ clipPath: 'circle(0% at 50% 50%)' }}
            animate={{ clipPath: 'circle(100% at 50% 50%)' }}
            exit={{ clipPath: 'circle(0% at 50% 50%)' }}
            transition={{ duration: 1 }}
        >
        <Box
            sx={{
                width: '100%',
                height: '100%',
                minHeight: '100vh', // Ensure it takes at least the full height of the viewport
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                bgcolor: '#4A148C',
                gap: 2,
            }}
        >
            <Box
                maxWidth={750}
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'center'}
            >
                <Typography variant="h2" gutterBottom sx={{ color: 'white' }}>
                    Rate Your Experience
                </Typography>
                <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
                    How would you rate your experience with our chatbot?
                </Typography>
            </Box>
            <Stack
                direction="column"
                spacing={2}
                width="100%"
                maxWidth={360}
            >
                <Box
                    display={'flex'}
                    flexDirection={'column'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    gap={2}
                >
                <ReactStars
                    count={5}
                    size={50}
                    color2={'#ffd700'}
                    value={0.5}
                    onChange={ratingChanged}
                />
                <TextField
                    label="Feedback (Optional)"
                    variant="outlined"
                    multiline
                    rows={4}
                    fullWidth
                    sx={textfieldStyle}
                />
                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        bgcolor: '#0A5C36',
                        ':hover': {
                            bgcolor: '#14452F',
                        }
                    }}
                    component={Link}
                    to="/chatbot"
                    onClick={(e) => {
                        console.log('Rating and feedback submitted');
                    }}
                >
                    Submit
                </Button>
                </Box>
            </Stack>
            <Typography
                variant="h7"
                gutterBottom
                sx={{ color: 'white' }}
            >
                Upon submission, you will be redirected back to the chatbot.
            </Typography>
        </Box>
        </motion.div>
        </AnimatePresence>
    )
}

export default Feedback;