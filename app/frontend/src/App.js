import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import HRLogin from './components/Login/HRLogin';
import Login from './components/Login/Login';
import HomePage from './components/HomePage';
import EmployeeView from './components/EmployeeView/EmployeeView';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Initialize with null
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedUserType = localStorage.getItem('user_type');
    if (token && storedUserType) {
      setIsLoggedIn(true);
      setUserType(storedUserType);
    } else {
      setIsLoggedIn(false);
      setUserType(null);
    }
  }, []);

  const handleLogin = (token, userType) => {
    setIsLoggedIn(true);
    setUserType(userType);
    localStorage.setItem('access_token', token);
    localStorage.setItem('user_type', userType);
    if (userType === 'admin') {
      navigate('/home');
    } else {
      navigate('/hr-view');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_type');
    navigate('/login');
  };

  if (isLoggedIn === null) {
    return <div>Loading...</div>; // Render loading state while determining login status
  }

  const isAdmin = userType === 'admin';

  return (
    <Routes>
      <Route path="/hr-login" element={<HRLogin onLogin={handleLogin} />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/home" element={
        isLoggedIn ? (
          isAdmin ? (
            <HomePage onLogout={handleLogout} />
          ) : (
            <Navigate to="/hr-view" />
          )
        ) : (
          <Navigate to="/login" />
        )
      } />
      <Route path="/hr-view" element={
        isLoggedIn ? (
          <EmployeeView />
        ) : (
          <Navigate to="/login" />
        )
      } />
      <Route path="/" element={
        isLoggedIn ? (
          isAdmin ? (
            <Navigate to="/home" />
          ) : (
            <Navigate to="/hr-view" />
          )
        ) : (
          <Navigate to="/login" />
        )
      } />
    </Routes>
  );
}

export default App;