import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';
import LoadingAnimation from '../Loading/LoadingAnimation';
import { hrLogin } from '../../api';

const HRLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateEmail(email)) {
      setError("Invalid email format");
      return;
    }
    const userData = {
      email: email,
      password: password,
    };
    console.log('Submitting data:', userData);
    setLoading(true);
    try {
      const data = await hrLogin(userData);
      console.log('User logged in successfully:', data);
      onLogin(data.access_token, data.user_type, data.user_role, true);
      window.location.href = '/home';
    } catch (error) {
      setError('Error logging in, please try again later');
      console.error('Error logging in:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ textAlign: 'right' }}>
      <h2>HR Login</h2>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <LoadingAnimation />
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            id='email'
            type="text"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
          />
          <input
            id='password'
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
          <button type="submit">Login</button>
          <div className="admin-link">
            <Link to="/login">Login as Admin</Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default HRLogin;
