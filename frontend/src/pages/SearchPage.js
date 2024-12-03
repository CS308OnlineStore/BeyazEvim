import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const SearchPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const searchString = new URLSearchParams(location.search).get('searchString') || ''; // Get the search term or default to an empty string

  useEffect(() => {
    if (searchString.trim()) { // Ensure there's a valid search string
      setLoading(true);
      setError(null); // Reset error before fetching
      console.log(searchString);

      axios
        .get(`/api/product-models/search/${encodeURIComponent(searchString.trim())}`)
        .then((response) => {
          setProducts(response.data);
        })
        .catch((error) => {
          // Log detailed error
          console.error('Error fetching search results:', error.response || error.message);

          // Customize error message for the user
          if (error.response) {
            // Handle API response errors (e.g., 404, 500)
            if (error.response.status === 403) {
                setError('You do not have permission to access this resource.');
              } else if (error.response.status === 404) {
                setError('No products found for the given search term.');
              } else {
                setError(`Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
              }
            } else if (error.request) {
              setError('No response from the server. Please check your network connection.');
            } else {
              setError(error.message || 'An unknown error occurred.');
            }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [searchString]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Check if a searchString was provided */}
      {searchString.trim() ? (
        <>
          <h1>Search Results for "{searchString}"</h1>
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
            {/* Display products if found */}
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
              // Display a message if no products are found
              !loading && <p>No products found for your search.</p>
            )}
          </div>
        </>
      ) : (
        // Message for when no search term is provided
        <h1>Please enter a search term to see results.</h1>
      )}
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


export default SearchPage;
