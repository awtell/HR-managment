import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';
import LoadingAnimation from '../Loading/LoadingAnimation';

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
      password: password
    };
    console.log('Submitting data:', userData);

    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        setError(`Error: ${errorData.error}`);
        console.error('Error logging in:', errorData);
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('User logged in successfully:', data);
      onLogin(data.access_token, data.user_type, data.user_role, true);
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
          <Link to="/login">Login as Admin</Link>
        </form>
      )}
    </div>
  );
};

export default HRLogin;
