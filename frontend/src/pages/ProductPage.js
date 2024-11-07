// src/pages/ProductPage.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

// Dummy data for product details and filter options
const productDetails = {
  id: 1,
  name: 'Washing Machine',
  description: 'A detailed description of the washing machine.',
  price: '₺2000',
  brand: 'Brand A',
  color: 'White',
  image: 'https://via.placeholder.com/150',
};

const filterOptions = {
  brand: ['Arcelik', 'Korkmaz', 'Philips'],
  color: ['White', 'Silver', 'Black', 'Magenta', 'Blue', 'Brown'],
  price: ['0 - 1000 TL', '1000 - 5000 TL', '5000 - 10000 TL'],
};

const ProductPage = () => {
  const { id } = useParams(); // Get product id from URL
  const [selectedFilters, setSelectedFilters] = useState({
    brand: '',
    color: '',
    price: '',
  });

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Filter Sidebar */}
      <div style={filterSidebarStyle}>
        <h2>Filters</h2>
        {Object.keys(filterOptions).map((filterType) => (
          <div key={filterType} style={{ marginBottom: '20px' }}>
            <h3>{filterType.charAt(0).toUpperCase() + filterType.slice(1)}</h3>
            {filterOptions[filterType].map((option) => (
              <div key={option}>
                <input
                  type="radio"
                  name={filterType}
                  value={option}
                  checked={selectedFilters[filterType] === option}
                  onChange={() => handleFilterChange(filterType, option)}
                />
                <label style={{ marginLeft: '8px' }}>{option}</label>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Product Details Section */}
      <div style={productDetailsStyle}>
        <img src={productDetails.image} alt={productDetails.name} style={{ width: '150px', height: '150px', borderRadius: '10px' }} />
        <h1>{productDetails.name}</h1>
        <p>{productDetails.description}</p>
        <p style={{ fontWeight: 'bold' }}>{productDetails.price}</p>
      </div>
    </div>
  );
};

// CSS styles
const filterSidebarStyle = {
  width: '250px',
  padding: '20px',
  borderRight: '1px solid #ddd',
};

const productDetailsStyle = {
  padding: '20px',
  flexGrow: 1,
};

export default ProductPage;
