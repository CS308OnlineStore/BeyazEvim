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
      const response = await fetch('/login', {  // Adjust URL as per your backend
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
        
        alert('Giriş başarılı!');
        
        // Redirect to the main page or dashboard, e.g., '/main' or '/dashboard'
        navigate('/');
      } else {
        // Handle specific status codes with error messages based on API documentation
        switch (response.status) {
          case 400:
            alert('Geçersiz istek. Lütfen bilgilerinizi kontrol edin.');
            break;
          case 401:
            alert('Yetkisiz giriş. E-posta veya şifre yanlış.');
            break;
          case 404:
            alert('Kullanıcı bulunamadı. Lütfen e-postanızı kontrol edin.');
            break;
          case 500:
            alert('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
            break;
          default:
            alert('Bilinmeyen bir hata oluştu.');
        }
      }
    } catch (error) {
      console.error('Giriş sırasında hata oluştu:', error);
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', marginTop: '150px' }}>
      <h2 style={{ textAlign: 'center' }}>Giriş Yap</h2>
      <form onSubmit={handleLogin}>
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
          Giriş Yap
        </button>
      </form>
    </div>
  );
}

export default SignIn;
