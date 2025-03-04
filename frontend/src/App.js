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
import Wishlist from './pages/Whislist.js';
import SalesManager from './pages/SalesManager.js';
import RefundRequestsPage from './pages/RefundRequestsPage';
import RevenueAnalysisPage from './pages/RevenueAnalysisPage';
import ViewInvoicesPage from './pages/ViewInvoicesPage';
import SetDiscountPage from './pages/SetDiscountPage';

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
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/sales-manager" element={<SalesManager />} />
        <Route path="/refundrequests" element={<RefundRequestsPage />} />
        <Route path="/revenueanalysis" element={<RevenueAnalysisPage />} />
        <Route path="/viewinvoices" element={<ViewInvoicesPage />} />
        <Route path="/setdiscount" element={<SetDiscountPage />} />
      </Routes>
    </Router>
  );
};

export default App;