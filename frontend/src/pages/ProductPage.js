// src/pages/ProductPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const ProductPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [productDetails, setProductDetails] = useState(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    axios.get(`/api/product-models/${id}`)
      .then(response => {
        setProductDetails(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the product details!", error);
      });
  }, [id]);

  const handleIncrease = () => {
    if (count < productDetails.stockCount) {
      setCount(prevCount => prevCount + 1);
    }
  };

  const handleDecrease = () => {
    if (count > 1) {
      setCount(prevCount => prevCount - 1);
    }
  };

  const handleAddToCart = async () => {
    const cartId = Cookies.get('cartId');
    
    if (cartId){
      for (let i = 0; i < count; i++) {
        try {
          const response = await axios.post(`/api/order-items/add?orderId=${cartId}&productModelId=${id}`);
          if (response.status === 200) { 
            //alert('Successfully added to cart!');
          } else {
            //alert('Cannot add to cart!');
          }
        } catch (error) {
          console.error("There was an error fetching the product details!", error);
        }
      }
      navigate('/');
    }
    else {
      console.log('Cart ID not found!');
    }
  }

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
        <p>In Stock : {productDetails.stockCount}</p>

        {/* Counter Component */}
        <div style={counterStyle}>
          <button onClick={handleDecrease} style={buttonStyle}>-</button>
          <span style={countStyle}>{count}</span>
          <button onClick={handleIncrease} style={buttonStyle}>+</button>
        </div>

        {/* Add to Cart Button */}
        <button style={addToCartButtonStyle} onClick={handleAddToCart}>Add to Cart</button>
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

const counterStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  marginTop: '20px',
};

const buttonStyle = {
  width: '40px',
  height: '40px',
  fontSize: '20px',
  fontWeight: 'bold',
  borderRadius: '5px',
  border: '1px solid #ccc',
  cursor: 'pointer',
  backgroundColor: '#f8f8f8',
};

const countStyle = {
  fontSize: '20px',
  fontWeight: 'bold',
};

const addToCartButtonStyle = {
  marginTop: '20px',
  padding: '10px 20px',
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#fff',
  backgroundColor: '#007BFF',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default ProductPage;
