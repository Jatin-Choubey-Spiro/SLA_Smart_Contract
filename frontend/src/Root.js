import React, { useState, useEffect } from 'react';
import Login from './login';
import App from './App';

const Root = () => {
  // Initialize state from localStorage or default to false
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  // Handle login
  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true'); // Persist state
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('isAuthenticated', 'false'); // Clear persisted state
  };

  return (
    <div>
      {isAuthenticated ? (
        <App onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default Root;
