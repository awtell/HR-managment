import React, { useState } from 'react';
import { adminLogin } from '../../api';
import './Login.css';
import { Link } from 'react-router-dom';
import LoadingAnimation from '../Loading/LoadingAnimation';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    async function handleSubmit(event) {
        event.preventDefault();

        if (!validateEmail(email)) {
            setError("Invalid email format");
            return;
        }

        const adminCredentials = {
            email: email,
            password: password
        };

        console.log('Submitting admin credentials:', adminCredentials);

        setLoading(true);

        try {
            const data = await adminLogin(adminCredentials);
            console.log('Admin logged in successfully:', data);

            if (data.user_type === 'user') {
                window.location.href = '/employee-view';
            } else {
                onLogin(data.access_token, data.user_type);
                window.location.href = '/home';
            }
        } catch (error) {
            setError('Error logging in, please try again later');
            console.error('Error logging in:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-container" style={{ textAlign: 'right' }}>
            <h2>Admin Login</h2>
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
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    <button type="submit">Login</button>
                    <Link to="/hr-login">Login as HR</Link>
                </form>
            )}
        </div>
    );
};

export default Login;
