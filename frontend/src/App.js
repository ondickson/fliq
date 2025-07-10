import React, { useContext, useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Home from './pages/Home';
import socket from './socket';

function ProtectedRoute({ children }) {
  const { currentUser } = useContext(AuthContext);
  return currentUser ? children : <Navigate to="/login" />;
}

function AppContent() {
  // const { currentUser } = useContext(AuthContext);
  // const [allMessages, setAllMessages] = useState([]);
  const [allMessages] = useState([]);

// App.js or InnerApp.js
useEffect(() => {
  socket.on('receive_message', (data) => {
    // console.log('Incoming message:', data);

    // Save to localStorage or Context for now
    const stored = JSON.parse(localStorage.getItem('fliq_messages')) || [];
    stored.push(data);
    localStorage.setItem('fliq_messages', JSON.stringify(stored));
  });

  return () => {
    socket.off('receive_message');
  };
}, []);


  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home allMessages={allMessages} />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
