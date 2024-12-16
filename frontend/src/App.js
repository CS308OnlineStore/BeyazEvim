// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import ProductPage from './pages/ProductPage';
import SignInSignUp from './pages/SignInSignUp';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import SubCategoryPage from './pages/SubCategoryPage';
import UserPage from './pages/UserPage';  
import SearchPage from './pages/SearchPage';
import ProductOwner from './pages/ProductOwner.js';
import ManageProductsPage from './pages/ManageProductsPage';
import ManageCategoriesPage from './pages/ManageCategoriesPage';
import UpdateProductStatusPage from './pages/UpdateProductStatusPage';
import DeliveryManagementPage from './pages/DeliveryManagementPage';
import ApproveCommentsPage from './pages/ApproveCommentsPage';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/signinsignup" element={<SignInSignUp />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/category/:subcategory" element={<SubCategoryPage />} /> 
        <Route path="/userpage" element={<UserPage />} /> 
        <Route path="/search" element={<SearchPage />} /> 
        <Route path="/product-owner" element={<ProductOwner />} />
        <Route path="/manage-products" element={<ManageProductsPage />} />
        <Route path="/manage-categories" element={<ManageCategoriesPage />} />
        <Route path="/update-product-status" element={<UpdateProductStatusPage />} />
        <Route path="/delivery-management" element={<DeliveryManagementPage />} />
        <Route path="/approve-comments" element={<ApproveCommentsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
