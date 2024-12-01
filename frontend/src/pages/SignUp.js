// src/SignUp.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    const userData = {
      firstName,
      lastName,
      email,
      password,
    };

    try {
      const response = await fetch('/register', { // Adjusted to match API documentation
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        // Registration successful
        alert('Registration successful!');
        navigate('/signin'); // Redirect to sign-in page after successful signup
      } else {
        // Handle specific status codes as per the API documentation
        switch (response.status) {
          case 400:
            alert('Invalid request. Please check your information.');
            break;
          case 409:
            alert('This email is already registered. Please use a different email.');
            break;
          case 500:
            alert('Server error. Please try again later.');
            break;
          default:
            alert('An unknown error occurred.');
        }
      }
    } catch (error) {
      console.error('An error occurred during registration:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', marginTop: '150px' }}>
      <h2 style={{ textAlign: 'center' }}>Kayıt Ol</h2>
      <form onSubmit={handleSignUp}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="firstName">Ad</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="lastName">Soyad</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="email">E-posta</label>
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
          <label htmlFor="password">Şifre</label>
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
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignUp;
