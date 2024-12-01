// SignInSignUp.js

import React from 'react';
import { useNavigate } from 'react-router-dom';

function SignInSignUp() {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    path === 'signin' ? navigate('/signin') : navigate('/signup');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', position: 'relative', marginTop: '200px' }}>
      <button
        onClick={() => handleNavigate('signin')}
        style={{ padding: '10px', width: '100%', marginBottom: '20px' }}
      >
        Sign In
      </button>
      <button
        onClick={() => handleNavigate('signup')}
        style={{ padding: '10px', width: '100%' }}
      >
        Sign Up
      </button>
    </div>
  );
}

export default SignInSignUp;
