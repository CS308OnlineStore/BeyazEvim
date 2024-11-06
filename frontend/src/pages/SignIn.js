// src/SignIn.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    try {
      const response = await fetch('http://localhost:8080/login', {  // Adjust URL as per your backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const result = await response.json();
        const token = result.token;

        // Store token for later use (example: localStorage)
        localStorage.setItem('authToken', token);
        
        alert('Login successful!');
        
        // Redirect to the main page or dashboard, e.g., '/main' or '/dashboard'
        navigate('/main');
      } else {
        // Handle specific status codes with error messages based on API documentation
        switch (response.status) {
          case 400:
            alert('Bad request. Please check your input.');
            break;
          case 401:
            alert('Unauthorized. Incorrect email or password.');
            break;
          case 404:
            alert('User not found. Please check your email.');
            break;
          case 500:
            alert('Server error. Please try again later.');
            break;
          default:
            alert('An unknown error occurred.');
        }
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', marginTop: '150px' }}>
      <h2 style={{ textAlign: 'center' }}>Sign In</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px', width: '100%' }}>
          Sign In
        </button>
      </form>
    </div>
  );
}

export default SignIn;
