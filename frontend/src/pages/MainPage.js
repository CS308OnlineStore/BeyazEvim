// src/pages/MainPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const categories = [
  {
    name: 'Small Kitchen Appliances',
    products: ['Tea and Coffee Makers', 'Blenders and Mixers', 'Sandwich Makers', 'Electric Grills'],
  },
  {
    name: 'Refrigerators',
    products: ['No-Frost Refrigerators', 'Combined Refrigerator', 'Mini Refrigerators', 'Retro Refrigerators'],
  },
  {
    name: 'Dryers',
    products: ['Condenser Dryers', 'Heat Pump Dryers'],
  },
  {
    name: 'Dishwashers',
    products: ['Built-in Dishwashers', 'Freestanding Dishwashers'],
  },
  {
    name: 'Ovens and Stoves',
    products: ['Cooktops', 'Freestanding Ovens', 'Built-in Ovens', 'Microwave Ovens'],
  },
  {
    name: 'Air Conditioners',
    products: ['Split Air Conditioners', 'Portable Air Conditioners', 'Window Air Conditioners'],

  },
  {
    name: 'Built-in Appliances',
    products: ['Built-in Cooktops', 'Built-in Range Hoods', 'Built-in Microwaves'],

  },
  {
    name: 'Vacuum Cleaners',
    products: ['Bagless Vacuum Cleaners', 'Bagged Vacuum Cleaners', 'Cordless Vacuum Cleaners'],

  },
  {
    name: 'Water Dispensers',
    products: ['Desktop Water Dispensers','Floor-Standing Water Dispensers'],

  },
  {
    name: 'Freezers',
    products: ['Chest Freezers', 'Upright Freezers'],

  },
  {
    name: 'Irons',
    products: ['Steam Irons', 'Dry Irons'],

  },

];

const MainPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  useEffect(() => {
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

  const handleCartClick = () => {
    navigate('/shoppingCart');
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

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header Section */}
      <header style={headerStyle}>
        <div style={logoStyle}>BeyazEvim</div>
        <input
          type="text"
          placeholder="What are you looking for?"
          style={searchBarStyle}
        />
        <div style={navIconsStyle}>
          <button onClick={handleLoginClick} style={navButtonStyle}>
            Login
          </button>
          <div onClick={handleCartClick} style={{ marginLeft: '15px', cursor: 'pointer' }}>
            <span role="img" aria-label="cart">🛒</span>
            Shopping Cart (0)
          </div>
        </div>
      </header>

      {/* Categories Section */}
      <nav style={categoryNavStyle}>
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
                  <div key={i} style={dropdownItemStyle}>
                    {product}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

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
  );
};

// CSS Styles as JavaScript objects
const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 20px',
  backgroundColor: '#333',
  color: 'white',
};

const logoStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
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
};

const categoryNavStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  padding: '10px 0',
  backgroundColor: '#000',
  color: '#fff',
  borderBottom: '1px solid #ddd',
  position: 'relative',
};

const categoryStyle = {
  position: 'relative',
  padding: '10px 15px',
  cursor: 'pointer',
};

const dropdownStyle = {
  position: 'absolute',
  top: '100%',
  left: 0,
  backgroundColor: 'white',
  boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
  padding: '10px',
  borderRadius: '5px',
  zIndex: 1,
  minWidth: '150px',
};

const dropdownItemStyle = {
  padding: '5px 10px',
  cursor: 'pointer',
  color: '#333',
  whiteSpace: 'nowrap',
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
