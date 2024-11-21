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
      const response = await fetch('/login', {  // Adjust URL as per your backend
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
            alert('Geçersiz istek. Lütfen bilgilerinizi kontrol edin.');
            break;
          case 401:
            alert('Yetkisiz giriş. E-posta veya şifre yanlış.');
            break;
          case 404:
            alert('Kullanıcı bulunamadı. Lütfen e-postanızı kontrol edin.');
            break;
          case 500:
            alert('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
            break;
          default:
            alert('Bilinmeyen bir hata oluştu.');
        }
      }
    } catch (error) {
      console.error('Giriş sırasında hata oluştu:', error);
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
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
      <h2 style={{ textAlign: 'center' }}>Giriş Yap</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="email">E-posta</label>
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
          <label htmlFor="password">Şifre</label>
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
