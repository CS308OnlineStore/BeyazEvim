// src/pages/MainPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Dummy product data
const products = [
  {
    id: 1,
    name: 'Washing Machine',
    description: '6kg capacity top load washing machine',
    price: '₺2000',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 2,
    name: 'Refrigerator',
    description: 'Double door with no frost technology',
    price: '₺4500',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 3,
    name: 'Microwave Oven',
    description: '800W with grill function',
    price: '₺1500',
    image: 'https://via.placeholder.com/150',
  },
];

const MainPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
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
          <div style={{ marginLeft: '15px', cursor: 'pointer' }}>
            <span role="img" aria-label="cart">
              🛒
            </span>
            Sepetim (0)
          </div>
        </div>
      </header>

      {/* Categories Section */}
      <nav style={categoryNavStyle}>
        <span>Küçük Ev Aletleri</span>
        <span>Beyaz Eşya</span>
        <span>Elektronik</span>
        <span>Isıtma - Soğutma</span>
        <span>Kişisel Bakım - Sağlık</span>
      </nav>

      {/* Product Grid */}
      <div style={{ padding: '20px' }}>
        <h1>BeyazEvim - Your White Goods Store</h1>
        <div style={productGridStyle}>
          {products.map((product) => (
            <div key={product.id} style={productCardStyle}>
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
  backgroundColor: '#f5f5f5',
  borderBottom: '1px solid #ddd',
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
};

export default MainPage;
