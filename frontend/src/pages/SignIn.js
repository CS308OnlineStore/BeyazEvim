// src/SignIn.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    let userID = 0;
    try {
      const response = await fetch('http://localhost:8080/login', {  // Adjust URL as per your backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const result = await response.json();
        const { token, firstName, lastName, userId } = result;

        Cookies.set('authToken', token, { expires: 7 }); 
        Cookies.set('userName', `${firstName} ${lastName}`, { expires: 7 });
        Cookies.set('userId', userId, { expires: 7 })

        userID = userId;
        
        alert('Giriş başarılı!');
      } 
      else {
        // Handle specific status codes with error messages based on API documentation
        switch (response.status) {
          case 400:
            alert('Invalid request. Please check your information.');
            break;
          case 401:
            alert('Unauthorized access. Email or password is incorrect.');
            break;
          case 404:
            alert('User not found. Please check your email.');
            break;
          case 500:
            alert('Server error. Please try again later.');
            break;
          default:
            alert('An unknown error occurred.');
        }
      }
    } catch (error) {
      console.error('An error occurred during login:', error);
      alert('An error occurred. Please try again.');
    }

    const nonUserCart = JSON.parse(localStorage.getItem('cart'))
    if ( nonUserCart && nonUserCart.items.length !== 0 ) {
      console.log(userID);

      await axios.get(`/api/orders/${userID}/cart`)
      .then((response) => {
        const { id } = response.data;
        localStorage.setItem('cartID', id)
      })
      .catch((error) => {
        console.error('Error requesting cart ID!:', error);
      });

      const cartID = localStorage.getItem('cartID')
      for ( let i = 0; i <  nonUserCart.items.length; i++ ) {
        for ( let j=0; j < nonUserCart.items[i].quantity; j++ ) {
          try {     
            const response = await axios.post(`/api/order-items/add?orderId=${cartID}&productModelId=${nonUserCart.items[i].productModel.id}`);
            if (response.status === 200 && j ===  nonUserCart.items[i].quantity-1 ) { 
              //alert('Successfully added to cart!');
            } 
          } catch (error) {
            console.error("There was an error fetching the product details!", error);
            //if ( j === 0 ) { alert(`Failed to add ${ nonUserCart.items[i].quantity-j} items to cart!`); }
            //else { alert(`Only ${j} items added to cart!`); }
            break; 
          }
        };
      };

      localStorage.removeItem('cartID');
      localStorage.removeItem('UserID')
      localStorage.removeItem('cart');
    }
    navigate('/')
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', marginTop: '150px' }}>
      <h2 style={{ textAlign: 'center' }}>Sign In</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px', width: '100%' }}>
          Giriş Yap
        </button>
      </form>
    </div>
  );
}

export default SignIn;
