// src/pages/ShoppingCart.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartUpdated, setCartUpdated] = useState(false);

  const userId = Cookies.get('userId');
   
  useEffect(() => {
    if (userId){
      axios.get(`/api/orders/${userId}/cart`)
        .then(response => {
          const { orderItems, totalPrice, id } = response.data;
          setCartItems(orderItems);
          setTotalPrice(totalPrice);
          Cookies.set('cartId', id, { expires: 7 });
        })
        .catch(error => {
          console.error('Error fetching cart data:', error);
        });
    }
  }, [userId, cartUpdated]);

  Cookies.set('totalPrice', totalPrice, { expires: 7 });
  Cookies.set('cartNum', cartItems.length, { expires: 7 });

  
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
  };

  return (
    <div>
      <h2>My Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {cartItems.map(item => (
              <li key={item.productModel.id} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{item.productModel.name} - {item.unitPrice}₺</span>
                  <button 
                    onClick={() => handleRemoveItem(item.productModel.id)} 
                    style={{ background: 'red', color: 'white', border: 'none', cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <h3>Total: {totalPrice}₺</h3>
            <button 
              style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }}
              onClick={() => alert('Proceeding with your order!')}
            >
              Complete Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
