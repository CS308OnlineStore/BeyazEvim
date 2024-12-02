import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const SearchPage = () => {
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
                  style={{
                    border: '1px solid #ddd',
                    padding: '10px',
                    borderRadius: '5px',
                    width: '200px',
                    textAlign: 'center',
                  }}
                >
                  <img
                    src={product.image_path || 'https://via.placeholder.com/150'}
                    alt={product.name}
                    style={{ width: '100%', borderRadius: '5px' }}
                  />
                  <h3 style={{ fontSize: '18px', margin: '10px 0' }}>{product.name}</h3>
                  <p style={{ fontSize: '14px', color: '#555' }}>{product.description}</p>
                  <p style={{ fontWeight: 'bold', margin: '10px 0' }}>₺{product.price.toFixed(2)}</p>
                  <p style={{ fontSize: '14px', color: '#777' }}>
                    Stock: {product.stockCount > 0 ? product.stockCount : 'Out of Stock'}
                  </p>
                  <p style={{ fontSize: '14px', color: '#777' }}>Brand: {product.brand}</p>
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

export default SearchPage;
