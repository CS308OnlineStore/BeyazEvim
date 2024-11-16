// src/pages/SubCategoryPage.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

// Sample data for demonstration
const sampleProducts = [
  {
    id: 1,
    name: 'Sample Product 1',
    description: 'Description for Sample Product 1',
    price: '₺1000',
    brand: 'Brand A',
    color: 'White',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 2,
    name: 'Sample Product 2',
    description: 'Description for Sample Product 2',
    price: '₺2000',
    brand: 'Brand B',
    color: 'Black',
    image: 'https://via.placeholder.com/150',
  },
];

const filterOptions = {
  price: ['0 - 1000 TL', '1000 - 5000 TL', '5000 - 10000 TL'],
  rating: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
  brand: ['Brand A', 'Brand B', 'Brand C'],
  color: ['White', 'Silver', 'Black', 'Blue'],
};

const SubCategoryPage = () => {
  const { subcategory } = useParams(); // Get subcategory name from URL
  const [selectedFilters, setSelectedFilters] = useState({
    price: '',
    rating: '',
    brand: '',
    color: '',
  });

  // Handle filter change
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

      {/* Product List */}
      <div style={productListStyle}>
        <h1>{subcategory}</h1>
        <div style={productGridStyle}>
          {sampleProducts.map((product) => (
            <div key={product.id} style={productCardStyle}>
              <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: '10px' }} />
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

// CSS styles for SubCategoryPage
const filterSidebarStyle = {
  width: '250px',
  padding: '20px',
  borderRight: '1px solid #ddd',
  backgroundColor: '#f9f9f9',
};

const productListStyle = {
  padding: '20px',
  flexGrow: 1,
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

export default SubCategoryPage;
