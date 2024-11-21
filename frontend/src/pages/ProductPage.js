// src/pages/ProductPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const ProductPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [productDetails, setProductDetails] = useState(null);
  const [count, setCount] = useState(1);

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
          if (response.status === 200 && i === count-1 ) { 
            alert('Successfully added to cart!');
          } 
        } catch (error) {
          console.error("There was an error fetching the product details!", error);
          if ( i === 0 ) { alert(`Failed to add ${count} items to cart!`); }
          else { alert(`Only ${i} items added to cart!`); }
          break; 
        }
      }
    }
    else {
      const nonUserEmptyCart = { items: [], totalPrice: 0.0 };  
      const nonUserCart = JSON.parse(localStorage.getItem('cart')) || nonUserEmptyCart;
      const itemsDetail = { "productModel" : productDetails, "quantity" : parseInt(`${count}`) }
      if ( nonUserCart.items.length === 0 ){
        nonUserCart.items.push(itemsDetail);
        nonUserCart.totalPrice += ( productDetails.price * count );
      }
      else {
        let match = false;
        for ( let i=0; i<nonUserCart.items.length; i++ ) {
          if ( productDetails.id === nonUserCart.items[i].productModel.id ) { 
            nonUserCart.items[i].quantity += count;
            nonUserCart.totalPrice += ( productDetails.price * count );
            match = true;  
            break;        
          }
        };
        if ( !match ) {
          nonUserCart.items.push(itemsDetail);
          nonUserCart.totalPrice += ( productDetails.price * count ); 
        }        
      }   
      localStorage.setItem('cart', JSON.stringify(nonUserCart));
      alert('Successfully added to cart!');
    }
    navigate('/');
  }

  //To be implemented later
  const handleAddToWishlist = () => {

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
        { productDetails.stockCount > 0 && ( <p>In Stock : {productDetails.stockCount}</p>) }

        {/* Counter Component */}
          {productDetails.stockCount > 0 ? (
            <div style={counterStyle}>
              <button onClick={handleDecrease} style={buttonStyle}>-</button>
              <span style={countStyle}>{count}</span>
              <button onClick={handleIncrease} style={buttonStyle}>+</button>
            </div>
          ) : (
            <p style={{ color: 'red', marginBottom: '10px' }}>Out of Stock</p>
          )}

          {/* Add to Cart Button */}
          {productDetails.stockCount > 0 ? (
            <button style={cartButtonStyle} onClick={handleAddToCart}>Add to Cart</button>
          ) : (
            <button style={cartButtonStyle} onClick={handleAddToWishlist}>Add to Wishlist</button>
          )}
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

const cartButtonStyle = {
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
