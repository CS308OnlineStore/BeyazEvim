import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import newLogo from '../assets/BeyazEvim_new_logo.jpeg';


const UserPage = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    firstName: 'Unknown',
    lastName: 'Unknown',
    email: 'Unknown',
    address: '',
    phoneNumber: '',
    role: 'Unknown',
  });
  const [pastOrders, setPastOrders] = useState([]);
  const [currentOrders, setCurrentOrders] = useState([]);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = Cookies.get('authToken');
    const userId = Cookies.get('userId');

    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserInfo(userResponse.data);

        const addressResponse = await axios.get(`/api/users/${userId}/address`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserInfo((prevState) => ({
          ...prevState,
          address: addressResponse.data.newAddress || '',
        }));

        const ordersResponse = await axios.get(`/api/orders/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const past = ordersResponse.data.filter(order => 
          order.status === 'DELIVERED' ||
          order.status === 'RETURNED'
        );
        const current = ordersResponse.data.filter(order => 
          order.status === 'PURCHASED' || 
          order.status === 'SHIPPED'
        );

        setPastOrders(past);
        setCurrentOrders(current);
      } catch (err) {
        console.error('API Error:', err);
        setError('Failed to load user information.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogoClick = () => {
    navigate('/'); // Navigate to the main page
  };

  const handleEditAddress = () => {
    setIsEditingAddress(true);
  };

  const handleSaveAddress = async () => {
    try {
      const token = Cookies.get('authToken');
      const userId = Cookies.get('userId');

      const response = await axios.put(
        `/api/users/${userId}/address`,
        { newAddress },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUserInfo((prevState) => ({
        ...prevState,
        address: response.data.address,
      }));

      setIsEditingAddress(false);
      setNewAddress('');
      alert('Address updated successfully.');
    } catch (err) {
      console.error('Error updating address:', err);
      alert('Failed to update address.');
    }
  };

  const handleEditPhone = () => {
    setIsEditingPhone(true);
  };

  const handleSavePhone = async () => {
    if (!/^\d{10,15}$/.test(newPhone)) {
      alert('Phone number must be 10-15 digits long.');
      return;
    }

    const token = Cookies.get('authToken');
    const userId = Cookies.get('userId');

    try {
      const response = await axios.put(
        `/api/users/${userId}/phone`,
        newPhone,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'text/plain',
          },
        }
      );

      setUserInfo((prevState) => ({
        ...prevState,
        phoneNumber: response.data.phoneNumber,
      }));

      setIsEditingPhone(false);
      setNewPhone('');
      alert('Phone number updated successfully.');
    } catch (err) {
      console.error('Error updating phone number:', err.response || err.message);

      if (err.response?.status === 403) {
        alert('You do not have permission to update the phone number. Please contact support.');
      } else {
        alert(`Failed to update phone number: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  const handleLogoutClick = () => {
    Cookies.remove('authToken');
    Cookies.remove('userId');
    Cookies.remove('userName');
    Cookies.remove('cartId');
    navigate('/');
    window.location.reload();
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>{error}</div>;

  return (

    
    <div style={pageContainerStyle}>
      <header style={logoContainerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleLogoClick}>
          <img src={newLogo} alt="BeyazEvim Logo" style={logoStyle} />
          <h1 style={logoTextStyle}>BeyazEvim</h1>
        </div>
      </header>
      <div style={contentContainerStyle}>
        <h2 style={sectionTitleStyle}>User Information</h2>
        <p><strong>First Name:</strong> {userInfo.firstName}</p>
        <p><strong>Last Name:</strong> {userInfo.lastName}</p>
        <p><strong>Email:</strong> {userInfo.email}</p>
        <p>
          <strong>Address:</strong> {isEditingAddress ? (
            <span>
              <input
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                style={inputStyle}
                placeholder="Enter new address"
              />
              <button onClick={handleSaveAddress} style={saveButtonStyle}>Save</button>
            </span>
          ) : (
            <>
              {userInfo.address || 'No address available'}
              <button onClick={handleEditAddress} style={editButtonStyle}>Edit</button>
            </>
          )}
        </p>
        <p>
          <strong>Phone Number:</strong> {isEditingPhone ? (
            <span>
              <input
                type="text"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                style={inputStyle}
                placeholder="Enter new phone number"
              />
              <button onClick={handleSavePhone} style={saveButtonStyle}>Save</button>
            </span>
          ) : (
            <>
              {userInfo.phoneNumber || 'No phone number available'}
              <button onClick={handleEditPhone} style={editButtonStyle}>Edit</button>
            </>
          )}
        </p>
        <p><strong>Role:</strong> {userInfo.role}</p>

        <h2 style={sectionTitleStyle}>Active Orders</h2>
        {currentOrders.length > 0 ? (
          currentOrders.map((order, index) => (
            <div key={index} style={orderCardStyle}>
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Items:</strong></p>
              <ul>
                {order.orderItems.map((item, idx) => (
                  <li key={idx}>
                    <p>{item.productModel.name} - {item.quantity} x ₺{item.unitPrice}</p>
                  </li>
                ))}
              </ul>
              <p><strong>Total:</strong> ₺{order.totalPrice}</p>
            </div>
          ))
        ) : (
          <p>No active orders.</p>
        )}

        <h2 style={sectionTitleStyle}>Past Orders</h2>
        {pastOrders.length > 0 ? (
          pastOrders.map((order, index) => (
            <div key={index} style={orderCardStyle}>
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Items:</strong></p>
              <ul>
                {order.orderItems.map((item, idx) => (
                  <li key={idx}>
                  <p>{item.productModel.name} - {item.quantity} x ₺{item.unitPrice}</p>
                </li>
                ))}
              </ul>
              <p><strong>Total:</strong> ₺{order.totalPrice}</p>
            </div>
          ))
        ) : (
          <p>No past orders.</p>
        )}
      </div>

      <button onClick={handleLogoutClick} style={logoutButtonStyle}>Logout</button>
    </div>
  );
};

// CSS styles...
const pageContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  minHeight: '100vh',
  fontFamily: 'Arial, sans-serif',
};

const contentContainerStyle = {
  width: '60%',
  textAlign: 'center',
};

const sectionTitleStyle = {
  marginBottom: '20px',
  fontWeight: 'bold',
  fontSize: '24px',
};

const logoutButtonStyle = {
  backgroundColor: '#ff0000',
  color: 'white',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
  border: 'none',
  marginBottom: '20px',
};

const editButtonStyle = {
  marginLeft: '10px',
  backgroundColor: '#007bff',
  color: 'white',
  padding: '5px 10px',
  borderRadius: '5px',
  cursor: 'pointer',
  border: 'none',
};

const saveButtonStyle = {
  marginLeft: '10px',
  backgroundColor: '#28a745',
  color: 'white',
  padding: '5px 10px',
  borderRadius: '5px',
  cursor: 'pointer',
  border: 'none',
};

const inputStyle = {
  marginLeft: '10px',
  padding: '5px',
  borderRadius: '5px',
  border: '1px solid #ddd',
};

const orderCardStyle = {
  border: '1px solid #ddd',
  padding: '10px',
  borderRadius: '5px',
  marginBottom: '10px',
  backgroundColor: '#f9f9f9',
};

const logoContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '20px',
  justifyContent: 'center',
  cursor: 'pointer', // Add this to make the logo clickable
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

export default UserPage;
