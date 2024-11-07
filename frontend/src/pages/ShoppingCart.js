// src/pages/ShoppingCart.js
import React, { useState } from 'react';

const ShoppingCart = () => {
  // Example cart items
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Product 1', price: 100 },
    { id: 2, name: 'Product 2', price: 150 },
  ]);

  const handleRemoveItem = (id) => {
    // Remove an item from the cart
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    // Calculate the total price
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>My Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {cartItems.map(item => (
              <li key={item.id} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{item.name} - {item.price}₺</span>
                  <button onClick={() => handleRemoveItem(item.id)} style={{ background: 'red', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <h3>Total: {calculateTotal()}₺</h3>
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
