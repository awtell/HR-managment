import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

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

        const userData = {
            email: email,
            password: password
        };

        console.log('Submitting data:', userData);

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
                console.error('Error creating user:', errorData);
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('User logged in successfully:', data);
            onLogin(data.access_token);
        } catch (error) {
            setError('Error logging in, please try again later');
            console.error('Error logging in:', error);
        }
    }

    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
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
            </form>
        </div>
    );
};

export default Login;
