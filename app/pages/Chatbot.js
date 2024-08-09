
'use client'

import { Box, Button, Stack, TextField } from '@mui/material'
import { createRef, useState, useEffect, useRef } from 'react'

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
    }, 50); // Speed of typing can be adjusted

    return () => clearInterval(timer);
  }, [text]);

  return <span className="typing">{displayText}</span>;
}




function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm the Headstarter support assistant. How can I help you today?",
    },
  ]);


  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true);
  
    // Add user message immediately.
    setMessages(prevMessages => [
      ...prevMessages,
      { role: 'user', content: message },
    ]);
  
    // Simulate processing delay and typing effect.
    await new Promise(resolve => setTimeout(resolve, 500)); // Delay to simulate processing
  
    // Add processing message and wait for it to finish typing.
    setMessages(prevMessages => [
      ...prevMessages,
      { role: 'assistant', content: "Processing your request..." },
    ]);
    
    await new Promise(resolve => setTimeout(resolve, "Processing your request...".length * 50)); // Wait for the typing effect
  
    // Fetch data from the API and handle response.
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: 'user', content: message }),
      });
  
      if (!response.ok) throw new Error('Network response was not ok');
  
      const resultText = "I'm sorry, but I encountered an error. Please try again later."; // Simplified for example
      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'assistant', content: resultText },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ]);
    }
  
    setIsLoading(false);
    setMessage(''); // Clear the input box after all processing
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
        height="700px"
        border="1px solid black"
        p={2}
        spacing={3}
      >
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box key={index} display="flex" justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}>
              <Box bgcolor={message.role === 'assistant' ? 'primary.main' : 'secondary.main'}
                color="white"
                borderRadius={16}
                p={3}
                sx={{ maxWidth: 'fit-content', width: 'auto' }}
              >
                <TypingMessage key={message.content} text={message.content} />
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
        <Stack direction="row" spacing={2} width="100%">
        <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            sx={{
              '& .MuiInputBase-input': {
                color: 'white', // Sets the text color inside the input field to white
              }
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