// src/pages/ProductPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProductPage = () => {
  const { id } = useParams(); // Get product id from URL
  const [productDetails, setProductDetails] = useState(null);

  useEffect(() => {
    axios.get(`/api/product-models/${id}`)
      .then(response => {
        setProductDetails(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the product details!", error);
      });
  }, [id]);

  if (!productDetails) {
    return <p>Loading product details...</p>;
  }

  return (
    <div style={productDetailsContainerStyle}>
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
const productDetailsContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  padding: '20px',
};

const productDetailsStyle = {
  padding: '20px',
  textAlign: 'center',
};

export default ProductPage;
