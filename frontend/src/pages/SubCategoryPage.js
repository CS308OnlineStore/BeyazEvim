// src/pages/SubCategoryPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SubCategoryPage = () => {
  const { subcategory } = useParams(); // Get subcategory ID from URL
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    price: '',
    brand: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch products and brands by category
    axios
      .get(`/api/categories/${subcategory}/productModels`)
      .then((response) => {
        setProducts(response.data.productModels || []);
        setBrands(response.data.brands || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching subcategory products:", error);
        setLoading(false);
      });
  }, [subcategory]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setSelectedFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  // Filter products based on selected filters
  const filteredProducts = products.filter((product) => {
    if (selectedFilters.price) {
      const [minPrice, maxPrice] = selectedFilters.price
        .replace('TL', '')
        .split('-')
        .map((price) => parseInt(price.trim(), 10));
      if (product.price < minPrice || product.price > maxPrice) {
        return false;
      }
    }
    if (selectedFilters.brand && product.distributorInformation !== selectedFilters.brand) {
      return false;
    }
    return true;
  });

  return (
    <div style={{ display: 'flex' }}>
      {/* Filter Sidebar */}
      <div style={filterSidebarStyle}>
        <h2>Filters</h2>

        {/* Price Filter */}
        <div style={{ marginBottom: '20px' }}>
          <h3>Price</h3>
          {['0 - 1000 TL', '1000 - 5000 TL', '5000 - 10000 TL'].map((option) => (
            <div key={option}>
              <input
                type="radio"
                name="price"
                value={option}
                checked={selectedFilters.price === option}
                onChange={() => handleFilterChange('price', option)}
              />
              <label style={{ marginLeft: '8px' }}>{option}</label>
            </div>
          ))}
        </div>

        {/* Brand Filter */}
        <div style={{ marginBottom: '20px' }}>
          <h3>Brand</h3>
          {brands.map((brand) => (
            <div key={brand}>
              <input
                type="radio"
                name="brand"
                value={brand}
                checked={selectedFilters.brand === brand}
                onChange={() => handleFilterChange('brand', brand)}
              />
              <label style={{ marginLeft: '8px' }}>{brand}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Product List */}
      <div style={productListStyle}>
        <h1>Products in {subcategory.category.name}</h1>
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div style={productGridStyle}>
            {filteredProducts.map((product) => (
              <div key={product.id} style={productCardStyle}>
                <img
                  src={product.photoPath || 'https://via.placeholder.com/150'}
                  alt={product.name}
                  style={{ width: '100%', borderRadius: '10px' }}
                />
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p style={{ fontWeight: 'bold' }}>₺{product.price}</p>
              </div>
            ))}
          </div>
        )}
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
