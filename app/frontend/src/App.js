import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import HRLogin from './components/Login/HRLogin';
import Login from './components/Login/Login';
import HomePage from './components/HomePage';
import NavBar from './components/Navbar/NavBar';
import LoadingAnimation from './components/Loading/LoadingAnimation';
import './App.css'; // Ensure you have the CSS file imported
import { fetchCurrentUser } from './api';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [userType, setUserType] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [sidebarMinimized, setSidebarMinimized] = useState(() => {
    const savedState = localStorage.getItem('sidebarMinimized');
    return savedState === 'true';
  });
  const [isHRLogin, setIsHRLogin] = useState(() => {
    const savedState = localStorage.getItem('isHRLogin');
    return savedState === 'true';
  });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      fetchCurrentUser(token).then(data => {
        setIsLoggedIn(true);
        setUserType(data.role === 'admin' ? 'admin' : 'user');
        setUserRole(data.role);
      }).catch(() => {
        setIsLoggedIn(false);
        setUserType(null);
        setUserRole(null);
        setIsHRLogin(false);
      });
    } else {
      setIsLoggedIn(false);
      setUserType(null);
      setUserRole(null);
      setIsHRLogin(false);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  const handleLogin = (token, userType, userRole, isHR) => {
    setIsLoggedIn(true);
    setUserType(userType);
    setUserRole(userRole);
    setSidebarMinimized(true);
    setIsHRLogin(isHR);
    localStorage.setItem('access_token', token);
    localStorage.setItem('user_type', userType);
    localStorage.setItem('user_role', userRole);
    localStorage.setItem('sidebarMinimized', true);
    localStorage.setItem('isHRLogin', isHR);
    if (userType === 'admin') {
      navigate('/home');
    } else {
      navigate('/hr-view');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    setUserRole(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_type');
    localStorage.removeItem('user_role');
    localStorage.setItem('sidebarMinimized', true);
    localStorage.removeItem('isHRLogin');
  };

  useEffect(() => {
    localStorage.setItem('sidebarMinimized', sidebarMinimized);
  }, [sidebarMinimized]);

  useEffect(() => {
    localStorage.setItem('isHRLogin', isHRLogin);
  }, [isHRLogin]);

  if (isLoggedIn === null) {
    return <div>Loading...</div>;
  }

  const isAdmin = userType === 'admin';

  return (
    <div className={`app-container ${loading ? 'loading-background' : ''}`}>
      {loading ? (
        <LoadingAnimation />
      ) : (
        <>
          {isLoggedIn && userRole !== 'RU' && <NavBar onLogout={handleLogout} />}
          <Routes>
            <Route path="/hr-login" element={<HRLogin onLogin={(token, userType, userRole) => handleLogin(token, userType, userRole, true)} />} />
            <Route path="/login" element={<Login onLogin={(token, userType, userRole) => handleLogin(token, userType, userRole, false)} />} />
            <Route path="/home" element={
              isLoggedIn ? (
                isAdmin ? (
                  <HomePage onLogout={handleLogout} userRole={userRole} sidebarMinimized={sidebarMinimized} setSidebarMinimized={setSidebarMinimized} isHRLogin={isHRLogin} />
                ) : (
                  <Navigate to="/hr-view" />
                )
              ) : (
                <Navigate to="/login" />
              )
            } />
            <Route path="/hr-view" element={
              isLoggedIn ? (
                <HomePage onLogout={handleLogout} userRole={userRole} sidebarMinimized={sidebarMinimized} setSidebarMinimized={setSidebarMinimized} isHRLogin={isHRLogin} />
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
        </>
      )}
    </div>
  );
}

export default App;
