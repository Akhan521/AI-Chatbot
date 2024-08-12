import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './pages/Home.js'
import Chatbot from './pages/Chatbot.js'
import Login from './pages/Login.js'
import Signup from './pages/Signup.js'
import Feedback from './pages/Feedback.js'

function App() {
  return (
    <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/feedback" element={<Feedback />} />
        </Routes>
    </Router>
  );
}

export default App;