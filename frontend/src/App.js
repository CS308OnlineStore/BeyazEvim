// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import ProductPage from './pages/ProductPage';
import SignInSignUp from './pages/SignInSignUp';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import SubCategoryPage from './pages/SubCategoryPage'; // Import SubCategoryPage

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/signinsignup" element={<SignInSignUp />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/category/:subcategory" element={<SubCategoryPage />} /> {/* Add SubCategoryPage route */}
      </Routes>
    </Router>
  );
};

export default App;
