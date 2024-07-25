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

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
  };

  return (
    <>
      {isLoggedIn ? <HomePage onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
    </>
  );
}

export default App;
