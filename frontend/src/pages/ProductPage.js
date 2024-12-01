// src/pages/ProductPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import logo from '../assets/BeyazEvim_logo.jpeg';

const ProductPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [productDetails, setProductDetails] = useState(null);
  const [count, setCount] = useState(1);
  const [isCartHovered, setIsCartHovered] = useState(false);
  const [cartNum, setCartNum] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0.0);

  useEffect(() => {
    axios.get(`/api/product-models/${id}`)
      .then(response => {
        setProductDetails(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the product details!", error);
      });

    const userId = Cookies.get('userId');
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
    
    if (cartId) {
      for (let i = 0; i < count; i++) {
        try {
          const response = await axios.post(`/api/order-items/add?orderId=${cartId}&productModelId=${id}`);
          if (response.status === 200 && i === count - 1) {
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

  const handleLogoClick = () => {
    navigate('/'); // Navigate to MainPage
  };
  //To be implemented later
  const handleAddToWishlist = () => {

  }

  if (!productDetails) {
    return <p>Loading product details...</p>;
  }

  return (
    <div>
      {/* Header Section */}
      <header style={headerStyle}>
        <div style={{ ...headerLeftStyle, cursor: 'pointer' }} onClick={handleLogoClick}>
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

      {/* Product Details Section */}
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
    </div>
  );
};

// CSS styles
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
