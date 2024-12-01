import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const SearchPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const searchString = new URLSearchParams(location.search).get('searchString');

  useEffect(() => {
    if (searchString) {
      setLoading(true);
      axios
        .get(`/api/product-models/search?searchString=${searchString}`)
        .then((response) => {
          setProducts(response.data);
        })
        .catch((error) => {
          console.error('Error fetching search results:', error);
          setError('Failed to fetch search results.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [searchString]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Search Results for "{searchString}"</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              style={{
                border: '1px solid #ddd',
                padding: '10px',
                borderRadius: '5px',
                width: '200px',
              }}
            >
              <img
                src={product.image_path || 'https://via.placeholder.com/150'}
                alt={product.name}
                style={{ width: '100%' }}
              />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p style={{ fontWeight: 'bold' }}>${product.price.toFixed(2)}</p>
              <p>Stock: {product.stockCount}</p>
              <p>Brand: {product.brand}</p>
            </div>
          ))
        ) : (
          !loading && <p>No products found for your search.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
