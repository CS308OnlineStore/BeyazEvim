import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

const UserPage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    firstName: 'Bilinmiyor',
    lastName: 'Bilinmiyor',
    email: 'Bilinmiyor',
    address: 'Bilinmiyor',
    phoneNumber: 'Bilinmiyor',
    role: 'Bilinmiyor',
  });
  const [pastOrders, setPastOrders] = useState([]);
  const [currentOrders, setCurrentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = Cookies.get('authToken');
    const userId = Cookies.get('userId');



    const fetchUserData = async () => {
      try {
        console.log('Token:', token);
        console.log('user ID:', userId);

        console.log('Fetching user information...');
        const userResponse = await axios.get(`/api/users/${userId}`, {
          //headers: { Authorization: `Bearer ${token}` },
        });
        console.log('User Info Response:', userResponse.data);
        setUserInfo(userResponse.data);

        console.log('Fetching user orders...');
        const ordersResponse = await axios.get(`/api/orders/user/${userId}`, {
          //headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Orders Response:', ordersResponse.data);

        const past = ordersResponse.data.filter(order => order.status === 'COMPLETED');
        const current = ordersResponse.data.filter(order => order.status !== 'COMPLETED');
        setPastOrders(past);
        setCurrentOrders(current);
      } catch (err) {
        console.error('API Hatası:', err);
        if (err.response?.data) {
          setError(err.response.data.message || 'Beklenmeyen bir hata oluştu.');
        } else {
          setError('Kullanıcı bilgileri yüklenemedi.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogoutClick = () => {
    Cookies.remove('authToken');
    Cookies.remove('userId');
    Cookies.remove('userName');
    navigate('/');
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Yükleniyor...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>{error}</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* User Info */}
      <h1>Hoş Geldiniz!</h1>
      <p><strong>Adı:</strong> {userInfo.firstName}</p>
      <p><strong>Soyadı:</strong> {userInfo.lastName}</p>
      <p><strong>E-posta:</strong> {userInfo.email}</p>
      <p><strong>Adres:</strong> {userInfo.address}</p>
      <p><strong>Telefon Numarası:</strong> {userInfo.phoneNumber}</p>
      <p><strong>Rol:</strong> {userInfo.role}</p>
      <button onClick={handleLogoutClick} style={logoutButtonStyle}>Çıkış Yap</button>

      {/* Current Orders */}
      <h2>Güncel Siparişler</h2>
      {currentOrders.length > 0 ? (
        <div>
          {currentOrders.map((order, index) => (
            <div key={index} style={orderCardStyle}>
              <p><strong>Sipariş ID:</strong> {order.id}</p>
              <p><strong>Durum:</strong> {order.status}</p>
              <p><strong>Toplam:</strong> ₺{order.totalPrice}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Güncel siparişiniz bulunmamaktadır.</p>
      )}

      {/* Past Orders */}
      <h2>Geçmiş Siparişler</h2>
      {pastOrders.length > 0 ? (
        <div>
          {pastOrders.map((order, index) => (
            <div key={index} style={orderCardStyle}>
              <p><strong>Sipariş ID:</strong> {order.id}</p>
              <p><strong>Durum:</strong> Teslim Edildi</p>
              <p><strong>Toplam:</strong> ₺{order.totalPrice}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Geçmiş siparişiniz bulunmamaktadır.</p>
      )}
    </div>
  );
};

// CSS styles
const logoutButtonStyle = {
  backgroundColor: '#ff0000',
  color: 'white',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
  border: 'none',
  margin: '10px 0',
};

const orderCardStyle = {
  border: '1px solid #ddd',
  padding: '10px',
  borderRadius: '5px',
  marginBottom: '10px',
  backgroundColor: '#f9f9f9',
};

export default UserPage;