// src/pages/ProductPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const filterOptions = {
  brand: ['Arcelik', 'Korkmaz', 'Philips'],
  color: ['White', 'Silver', 'Black', 'Magenta', 'Blue', 'Brown'],
  price: ['0 - 1000 TL', '1000 - 5000 TL', '5000 - 10000 TL'],
};

const ProductPage = () => {
  const { id } = useParams(); // Get product id from URL
  const [productDetails, setProductDetails] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    brand: '',
    color: '',
    price: '',
  });

  useEffect(() => {
    axios.get(`/api/product-models/${id}`)
      .then(response => {
        setProductDetails(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the product details!", error);
      });
  }, [id]);

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  if (!productDetails) {
    return <p>Loading product details...</p>;
  }

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
        <img src={productDetails.image || 'https://via.placeholder.com/150'} alt={productDetails.name} style={{ width: '150px', height: '150px', borderRadius: '10px' }} />
        <h1>{productDetails.name}</h1>
        <p>{productDetails.description}</p>
        <p style={{ fontWeight: 'bold' }}>₺{productDetails.price}</p>
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
