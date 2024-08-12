"use client";

import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import { createRef, useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const typingSpeed = 30; // Speed of typing can be adjusted here

function TypingMessage({ text }) {
  const [displayText, setDisplayText] = useState('');
  const index = useRef(0);
  const displayTextRef = useRef("");

  useEffect(() => {

    const timer = setInterval(() => {
      if (index.current < text.length) {
        displayTextRef.current += text.charAt(index.current);
        setDisplayText(() => displayTextRef.current);
        index.current += 1;
      } else {
        clearInterval(timer);
      }
    }, typingSpeed);

    return () => clearInterval(timer);
  }, [text]);

  return <span className="typing">{displayText}</span>;
}

function Chatbot() {

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your personal support assistant. How can I help you today?",
    },
  ]);

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true);

    setMessage('')
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: "" },
    ])
  
    // Fetch data from the API and handle response.
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }]),
      });
  
      if (!response.ok) throw new Error('Network response was not ok');
  
      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value, { stream: true })
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ]
        })
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(messages => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ]);
    }
  
    setIsLoading(false);
  };
  

const handleKeyPress = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
};

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom()
  }, [messages])


  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        direction="column"
        width="100vw"
        height="100vh"
        border="1px solid #9A9498"
        p={2}
        spacing={3}
      >
        <Stack
          direction="column"
          spacing={5}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
          p={2}
        >
          {messages.map((message, index) => (
            <Box key={index} display="flex" justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}>
              <Box bgcolor={message.role === 'assistant' ? 'primary.main' : 'secondary.main'}
                color="white"
                borderRadius={16}
                p={3}
                sx={{ maxWidth: 'fit-content', width: 'auto'}}
              >
                <TypingMessage key={message.content} text={message.content} />
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
        <Stack direction="row" spacing={2} width="100%">
        <Button
            sx={{
              bgcolor: '#673ab7',
              ':hover': {
                bgcolor: '#4A148C', // Darker shade for hover on login
              }
            }}
            variant="contained"
            color="primary"
            component={Link}
            to="/feedback"
          >Feedback 
        </Button>
        <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            sx={{
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
            }}
          />
          <Button variant="contained" onClick={sendMessage} disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default Chatbot;