// src/pages/SubCategoryPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/BeyazEvim_logo.jpeg';

const SubCategoryPage = () => {
  const { subcategory } = useParams(); // Get subcategory ID from URL
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    price: '',
    brand: '',
  });
  const [loading, setLoading] = useState(true);
  const [cartNum, setCartNum] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0.0);
  const [isCartHovered, setIsCartHovered] = useState(false);

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

    // Fetch cart information
    const userId = localStorage.getItem('userId');
    if (userId) {
      axios.get(`/api/orders/${userId}/cart`)
        .then((response) => {
          const { orderItems, totalPrice } = response.data;
          setCartNum(orderItems.length);
          setTotalPrice(totalPrice);
        })
        .catch((error) => {
          console.error('Error fetching cart details:', error);
        });
    } else {
      const nonUserCart = JSON.parse(localStorage.getItem('cart')) || { items: [], totalPrice: 0.0 };
      setCartNum(nonUserCart.items.length);
      setTotalPrice(nonUserCart.totalPrice);
    }
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
    <div>
      {/* Header Section */}
      <header style={headerStyle}>
        <div style={headerLeftStyle}>
          <img src={logo} alt="BeyazEvim Logo" style={logoStyle} />
          <h3 style={logoTextStyle}>BeyazEvim</h3>
        </div>
        <input
          type="text"
          placeholder="What are you looking for?"
          style={searchBarStyle}
        />
        <div style={navIconsStyle}>
          <div style={cartContainerStyle}>
            <div
              style={isCartHovered ? hoveredCartIconStyle : cartIconStyle}
              onMouseEnter={() => setIsCartHovered(true)}
              onMouseLeave={() => setIsCartHovered(false)}
            >
              <span role="img" aria-label="cart">
                🛒
              </span>
            </div>
            <div style={cartTextStyle}>
              <span style={cartPriceStyle}>Sepetim ({cartNum})</span>
              <br />
              <span style={cartItemCountStyle}>{totalPrice} TL</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
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
          <h1>Products in {subcategory.categoryName}</h1>
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
    </div>
  );
};

// CSS styles for SubCategoryPage
const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 20px',
  backgroundColor: '#333',
  color: 'white',
};

const headerLeftStyle = {
  display: 'flex',
  alignItems: 'center',
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

const cartContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '10px',
  color: 'white',
};

const cartIconStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  backgroundColor: '#333',
  borderRadius: '50%',
  fontSize: '20px',
  color: 'white',
  marginRight: '10px',
  cursor: 'pointer',
};

const hoveredCartIconStyle = {
  ...cartIconStyle,
  backgroundColor: 'red',
};

const cartTextStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  fontSize: '14px',
};

const cartPriceStyle = {
  fontSize: '12px',
  color: 'white',
};

const cartItemCountStyle = {
  color: 'white',
  fontWeight: 'bold',
};

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
