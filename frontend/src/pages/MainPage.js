// src/pages/MainPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import ShoppingCart from './ShoppingCart';
import logo from '../assets/BeyazEvim_logo.jpeg'; // Ensure this path is correct and matches your project structure

const categories = [
  { name: 'Small Kitchen Appliances', products: ['Tea and Coffee Makers', 'Blenders and Mixers', 'Sandwich Makers', 'Electric Grills'] },
  { name: 'Refrigerators', products: ['No-Frost Refrigerators', 'Combined Refrigerator', 'Mini Refrigerators', 'Retro Refrigerators'] },
  { name: 'Dryers', products: ['Condenser Dryers', 'Heat Pump Dryers'] },
  { name: 'Dishwashers', products: ['Built-in Dishwashers', 'Freestanding Dishwashers'] },
  { name: 'Ovens and Stoves', products: ['Cooktops', 'Freestanding Ovens', 'Built-in Ovens', 'Microwave Ovens'] },
  { name: 'Air Conditioners', products: ['Split Air Conditioners', 'Portable Air Conditioners', 'Window Air Conditioners'] },
  { name: 'Built-in Appliances', products: ['Built-in Cooktops', 'Built-in Range Hoods', 'Built-in Microwaves'] },
  { name: 'Vacuum Cleaners', products: ['Bagless Vacuum Cleaners', 'Bagged Vacuum Cleaners', 'Cordless Vacuum Cleaners'] },
  { name: 'Water Dispensers', products: ['Desktop Water Dispensers', 'Floor-Standing Water Dispensers'] },
  { name: 'Freezers', products: ['Chest Freezers', 'Upright Freezers'] },
  { name: 'Irons', products: ['Steam Irons', 'Dry Irons'] }
];

const MainPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const token = Cookies.get('authToken');
    const userName = Cookies.get('userName');
    
    if (token) {
      setUserName(userName);
    }
    
    axios.get('/api/homepage')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the products!", error);
      });
  }, []);

  const handleLoginClick = () => {
    navigate('/signinsignup');
  };

  const handleLogoutClick = () => {
    Cookies.remove('authToken');
    Cookies.remove('userName');
    setUserName('');
    navigate('/');
  };

  const handleCartClick = () => {
    setIsCartVisible(!isCartVisible);
  };

  const handleMouseEnter = (category) => {
    setHoveredCategory(category);
  };

  const handleMouseLeave = () => {
    setHoveredCategory(null);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleSubCategoryClick = (subcategory) => {
    navigate(`/category/${subcategory}`);
  };


  return (
    <div style={{ fontFamily: 'Arial, sans-serif', display: 'flex' }}>
      {/* Sidebar Categories Section */}
      <div style={{ width: '250px' }}>
        <div style={logoContainerStyle}>
          <img src={logo} alt="BeyazEvim Logo" style={logoStyle} />
          <h3 style={logoTextStyle}>BeyazEvim</h3>
        </div>
        <nav style={sidebarStyle}>
          <h3>Categories</h3>
          {categories.map((category, index) => (
            <div
              key={index}
              onMouseEnter={() => handleMouseEnter(category)}
              onMouseLeave={handleMouseLeave}
              style={categoryStyle}
            >
              {category.name}
              {hoveredCategory === category && (
                <div style={dropdownStyle}>
                  {category.products.map((product, i) => (
                    <div key={i} style={dropdownItemStyle}onClick={() => handleSubCategoryClick(product)}>
                      {product}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1 }}>
        {/* Header Section */}
        <header style={headerStyle}>
          <input
            type="text"
            placeholder="What are you looking for?"
            style={searchBarStyle}
          />
          <div style={navIconsStyle}>
            {userName ? (
              <div
                onClick={handleLogoutClick}
                onMouseEnter={() => setIsHovered(true)}  
                onMouseLeave={() => setIsHovered(false)} 
                style={isHovered ? hoveredButtonStyle : navButtonStyle}
              >
                {isHovered ? 'Logout' : userName}
              </div>
            ) : (
              <button onClick={handleLoginClick} style={navButtonStyle}>
                Login
              </button>
            )}
            <div onClick={handleCartClick} style={{ marginLeft: '15px', cursor: 'pointer' }}>
              <span role="img" aria-label="cart">🛒</span>
              Shopping Cart (0)
            </div>
          </div>
        </header>

        {/* Cart Dropdown or Sidebar */}
        {isCartVisible && (
          <div style={cartDropdownStyle}>
            <ShoppingCart />
          </div>
        )}

        {/* Product Grid */}
        <div style={{ padding: '20px' }}>
          <h1>BeyazEvim - Your White Goods Store</h1>
          <div style={productGridStyle}>
            {products.map((product) => (
              <div key={product.id} style={productCardStyle} onClick={() => handleProductClick(product.id)}>
                <img
                  src={product.image || 'https://via.placeholder.com/150'}
                  alt={product.name}
                  style={{ width: '100%', borderRadius: '10px' }}
                />
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p style={{ fontWeight: 'bold' }}>₺{product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// CSS Styles as JavaScript objects
const logoContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '20px',
  borderBottom: '1px solid #ddd',
  justifyContent: 'center',
};

const logoStyle = {
  width: '50px',
  height: '50px',
  marginRight: '10px',
};

const logoTextStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#ff0000',
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 20px',
  backgroundColor: '#333',
  color: 'white',
};

const searchBarStyle = {
  width: '50%',
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ddd',
};

const navIconsStyle = {
  display: 'flex',
  alignItems: 'center',
};

const navButtonStyle = {
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease, color 0.3s ease',
  minWidth: '100px',
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '40px',
};

const hoveredButtonStyle = {
  ...navButtonStyle,
  backgroundColor: 'red',
  color: 'white',
};

const sidebarStyle = {
  padding: '20px',
  backgroundColor: '#f5f5f5',
};

const categoryStyle = {
  position: 'relative',
  padding: '10px 0',
  cursor: 'pointer',
  color: '#333',
};

const dropdownStyle = {
  position: 'absolute',
  left: '100%',
  top: 0,
  backgroundColor: 'white',
  boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
  padding: '10px',
  borderRadius: '5px',
  zIndex: 1,
  minWidth: '200px',
};

const dropdownItemStyle = {
  padding: '5px 10px',
  cursor: 'pointer',
  color: '#333',
  whiteSpace: 'nowrap',
};

const cartDropdownStyle = {
  position: 'absolute',
  top: '60px',
  right: '20px',
  width: '300px',
  backgroundColor: 'white',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  padding: '10px',
  zIndex: 100,
  borderRadius: '5px',
};

const productGridStyle = {
  display: 'flex',
  gap: '20px',
  flexWrap: 'wrap',
};

const productCardStyle = {
  border: '1px solid #ddd',
  borderRadius: '10px',
  padding: '10px',
  width: '200px',
  textAlign: 'center',
  cursor: 'pointer',
};

export default MainPage;
