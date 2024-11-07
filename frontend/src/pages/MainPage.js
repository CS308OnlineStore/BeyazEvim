// src/pages/MainPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Dummy product data
const products = [
  {
    id: 1,
    name: 'Washing Machine',
    description: '6kg capacity top load washing machine',
    price: '₺2000',
    image: 'https://via.placeholder.com/150',
    brand: 'Arcelik',
    color: 'White',
  },
  {
    id: 2,
    name: 'Refrigerator',
    description: 'Double door with no frost technology',
    price: '₺4500',
    image: 'https://via.placeholder.com/150',
    brand: 'Korkmaz',
    color: 'Black',
  },
  {
    id: 3,
    name: 'Microwave Oven',
    description: '800W with grill function',
    price: '₺1500',
    image: 'https://via.placeholder.com/150',
    brand: 'Philips',
    color: 'Silver',
  },
];

// Categories and product types data
const categories = [
  {
    name: 'Küçük Ev Aletleri',
    products: ['Toaster', 'Blender', 'Vacuum Cleaner'],
  },
  {
    name: 'Beyaz Eşya',
    products: ['Washing Machine', 'Refrigerator', 'Dishwasher'],
  },
  {
    name: 'Elektronik',
    products: ['TV', 'Speaker', 'Laptop'],
  },
  {
    name: 'Isıtma - Soğutma',
    products: ['Air Conditioner', 'Heater', 'Fan'],
  },
  {
    name: 'Kişisel Bakım - Sağlık',
    products: ['Hair Dryer', 'Shaver', 'Massage Chair'],
  },
];

const MainPage = () => {
  const navigate = useNavigate();
  const [hoveredCategory, setHoveredCategory] = useState(null);

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
          placeholder="Ne Aramıştınız?"
          style={searchBarStyle}
        />
        <div style={navIconsStyle}>
          <button onClick={handleLoginClick} style={navButtonStyle}>
            Giriş Yap
          </button>
          <div onClick={handleCartClick} style={{ marginLeft: '15px', cursor: 'pointer' }}>
            <span role="img" aria-label="cart">
              🛒
            </span>
            Sepetim (0)
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
                src={product.image}
                alt={product.name}
                style={{ width: '100%', borderRadius: '10px' }}
              />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p style={{ fontWeight: 'bold' }}>{product.price}</p>
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
