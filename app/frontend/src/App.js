import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import Login from './components/Login/Login';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (loggedIn) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (token) => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('access_token', token);
    console.log('Access Token:', token); // This will print the token to the console
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('access_token');
  };

  return (
    <>
      {isLoggedIn ? <HomePage onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
    </>
  );
}

export default App;
