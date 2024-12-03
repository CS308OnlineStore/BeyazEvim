// src/pages/ShoppingCart.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import PaymentForm from './MockPaymentForm';

const ShoppingCart = ({onClose}) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartUpdated, setCartUpdated] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const navigate = useNavigate();
  const userId = Cookies.get('userId');
   
  useEffect(() => {
    if (userId){
      axios.get(`/api/orders/${userId}/cart`)
        .then(response => {
          const { orderItems, totalPrice } = response.data;
          setCartItems(orderItems);
          setTotalPrice(totalPrice);
        })
        .catch(error => {
          console.error('Error fetching cart data:', error);
        });
    }
    else {
      const nonUserEmptyCart = { items: [], totalPrice: 0 };  
      const nonUserCart = JSON.parse(localStorage.getItem('cart')) || nonUserEmptyCart;
      setCartItems(nonUserCart.items);
      setTotalPrice(nonUserCart.totalPrice);
    }
  }, [userId, cartUpdated]);

  const handleRemoveItem = (itemId) => {
    const cartId = Cookies.get('cartId');
    if (cartId){
      axios.post(`/api/order-items/remove?orderId=${cartId}&productModelId=${itemId}`)
        .then(response => {
          if (response.status === 200) {
            setCartUpdated(prev => !prev);
          }
          else { alert("Failed to remove item from cart!"); }
        })
        .catch(error => {
          console.error('Error fetching cart data:', error);
        });
    }
    else {
      const nonUserEmptyCart = { items: [], totalPrice: 0 };  
      const nonUserCart = JSON.parse(localStorage.getItem('cart')) || nonUserEmptyCart;
      for ( let i=0; i<cartItems.length; i++ ) {
        if ( itemId === cartItems[i].productModel.id ){      
          if ( cartItems[i].quantity === 1 ) {
            nonUserCart.totalPrice -= ( cartItems[i].productModel.price );
            nonUserCart.items.splice(i, 1);
            setCartUpdated(prev => !prev);
            break; 
          }
          else {
            nonUserCart.totalPrice -= ( cartItems[i].productModel.price );
            nonUserCart.items[i].quantity -= 1;
            setCartUpdated(prev => !prev);
            break;
          }    
        }
      };
      localStorage.setItem('cart', JSON.stringify(nonUserCart));
    }
  };

  const handleCompleteOrder = () => {
    if (!userId) {
      alert("SignUp or Login to complete order!")
      navigate('/signinsignup');
    } else {
      setShowPayment(true);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '15px', backgroundColor: '#f9f9f9' }}>
      <h2 style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '15px', fontSize: '18px' }}>
        My Cart
      </h2>
      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'left' }}>
          <p>Your cart is empty.</p>
          <button
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              cursor: 'pointer',
              width: '100%',
              borderRadius: '5px',
              fontSize: '16px',
            }}
            onClick={onClose}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {cartItems.map((item, index) => (
              <li
                key={ item.productModel.id }
                style={{
                  padding: '15px 0',
                  borderBottom: index !== cartItems.length - 1 ? '1px solid #ccc' : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{ item.productModel.name }</strong>
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>{item.quantity} x {item.productModel.price}₺</p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.productModel.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'red',
                      fontSize: '18px',
                      cursor: 'pointer',
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div style={{ borderTop: '1px solid #ccc', paddingTop: '15px', marginTop: '15px', textAlign: 'left' }}>
            <p style={{ margin: 0, fontSize: '16px', color: '#666' }}>Total</p>
            <h3 style={{ margin: 0, fontWeight: 'bold', fontSize: '20px' }}>{totalPrice}₺</h3>
          </div>
          {/* Buttons */}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            {showPayment ? (
                <PaymentForm
                  onPaymentSuccess={() => {
                    setShowPayment(false);
                    onClose();
                  }}
                />
              ) : (
                <button
                  style={{
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    width: '100%',
                    marginBottom: '10px',
                    borderRadius: '5px',
                    fontSize: '16px',
                  }}
                  onClick={handleCompleteOrder}
                >
                  Complete Order
                </button>
              )}
            <br />
            <button
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                cursor: 'pointer',
                width: '100%',
                borderRadius: '5px',
                fontSize: '16px',
              }}
              onClick={onClose}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
