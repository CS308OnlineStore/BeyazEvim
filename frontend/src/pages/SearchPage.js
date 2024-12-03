import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import logo from '../assets/BeyazEvim_logo.jpeg';

const SearchPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('default'); // Sıralama için state

  const location = useLocation();
  const searchString = new URLSearchParams(location.search).get('searchString') || '';

  const userName = Cookies.get('userName');
  const cartNum = Cookies.get('cartNum') || 0;
  const totalPrice = Cookies.get('totalPrice') || 0;

  useEffect(() => {
    setSearchQuery(searchString);
    if (searchString.trim()) {
      setLoading(true);
      setError(null);

      axios
        .get(`/api/product-models/search/${encodeURIComponent(searchString.trim())}`)
        .then((response) => setProducts(response.data))
        .catch((error) => {
          console.error('Error fetching search results:', error);
          setError('Failed to fetch search results.');
        })
        .finally(() => setLoading(false));
    }
  }, [searchString]);

  useEffect(() => {
    if (products.length > 0) {
      let sortedProducts = [...products];
      switch (sortOption) {
        case 'popularity':
          sortedProducts.sort((a, b) => b.popularity - a.popularity);
          break;
        case 'alphabetical':
          sortedProducts.sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
          );
          break;
        case 'price':
          sortedProducts.sort((a, b) => a.price - b.price);
          break;
        default:
          sortedProducts = products;
          break;
      }
      setProducts(sortedProducts);
    }
  }, [sortOption, products]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      alert('Please enter a search term.');
      return;
    }
    navigate(`/search?searchString=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleLoginClick = () => {
    navigate('/signinsignup');
  };

  const handleUserPageClick = () => {
    navigate('/UserPage');
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', display: 'flex' }}>
      {/* Sidebar Categories Section */}
      <div style={{ width: '250px' }}>
        <div style={logoContainerStyle} onClick={() => navigate('/')}>
          <img src={logo} alt="BeyazEvim Logo" style={logoStyle} />
          <h3 style={logoTextStyle}>BeyazEvim</h3>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1 }}>
        {/* Header Section */}
        <header style={headerStyle}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', width: '100%' }}>
            <input
              type="text"
              placeholder="What are you looking for?"
              style={searchBarStyle}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" style={searchButtonStyle}>
              Search
            </button>
          </form>
          <div style={navIconsStyle}>
            {userName ? (
              <button onClick={handleUserPageClick} style={navButtonStyle}>
                {userName}
              </button>
            ) : (
              <button onClick={handleLoginClick} style={navButtonStyle}>
                Login
              </button>
            )}
            <div style={cartContainerStyle}>
              <div style={cartIconStyle} onClick={handleCartClick}>
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

        {/* Sort Dropdown */}
        <div style={sortDropdownContainerStyle}>
          <label htmlFor="sortDropdown" style={sortDropdownLabelStyle}>
            Sort by:
          </label>
          <select
            id="sortDropdown"
            style={sortDropdownStyle}
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="popularity">Popularity</option>
            <option value="alphabetical">Alphabetical</option>
            <option value="price">Price</option>
          </select>
        </div>

        {/* Search Results Section */}
        <div style={{ padding: '20px' }}>
          {searchString.trim() ? (
            <>
              <h1>Search Results for "{searchString}"</h1>
              {loading && <p>Loading...</p>}
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
                {products.length > 0 ? (
                  products.map((product) => (
                    <div
                      key={product.id}
                      style={productCardStyle}
                      onClick={() => handleProductClick(product.id)}
                    >
                      <img
                        src={product.image || 'https://via.placeholder.com/150'}
                        alt={product.name}
                        style={{ width: '100%', borderRadius: '10px' }}
                      />
                      <h3>{product.name}</h3>
                      <p>{product.description}</p>
                      <hr />
                      <p
                        style={{
                          fontWeight: 'bold',
                          color: product.stockCount > 0 ? 'inherit' : 'red',
                        }}
                      >
                        {product.stockCount > 0 ? `₺${product.price}` : 'OUT OF STOCK'}
                      </p>
                    </div>
                  ))
                ) : (
                  !loading && <p>No products found for your search.</p>
                )}
              </div>
            </>
          ) : (
            <h1>Please enter a search term to see results.</h1>
          )}
        </div>
      </div>
    </div>
  );
};

const productCardStyle = {
  border: '1px solid #ddd',
  borderRadius: '10px',
  padding: '10px',
  width: '200px',
  textAlign: 'center',
  cursor: 'pointer',
};

// CSS Styles as JavaScript objects
const logoContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '20px',
  borderBottom: '1px solid #ddd',
  justifyContent: 'center',
  cursor: 'pointer', // Logoya tıklanabilirlik eklendi
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

const searchButtonStyle = {
  padding: '10px',
  marginLeft: '10px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
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
  transition: 'background-color 0.3s ease',
};

const cartTextStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  fontSize: '14px',
  cursor: 'default',
};

const cartItemCountStyle = {
  color: 'white',
  fontWeight: 'bold',
};

const cartPriceStyle = {
  fontSize: '12px',
  color: 'white',
};

const sortDropdownContainerStyle = {
  marginBottom: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
};

const sortDropdownLabelStyle = {
  fontSize: '16px',
  fontWeight: 'bold',
  marginRight: '10px',
  color: '#333',
};

const sortDropdownStyle = {
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  fontSize: '16px',
  cursor: 'pointer',
  backgroundColor: '#fff',
};

export default SearchPage;
