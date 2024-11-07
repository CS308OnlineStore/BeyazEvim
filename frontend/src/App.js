// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage'; // Correct path to MainPage
import SignInSignUp from './pages/SignInSignUp';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import ShoppingCart from './pages/ShoppingCart';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/signinsignup" element={<SignInSignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/shoppingcart" element={<ShoppingCart />} />
      </Routes>
    </Router>
  );
}

export default App;
