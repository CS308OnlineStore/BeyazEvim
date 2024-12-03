import React, { useState } from 'react';
import { usePaymentInputs } from 'react-payment-inputs';
import images from 'react-payment-inputs/images';
import Cookies from 'js-cookie';
import axios from 'axios';

const PaymentForm = ({ onPaymentSuccess }) => {
  const cartId = Cookies.get('cartId');

  const { getCardNumberProps, getExpiryDateProps, getCVCProps, wrapperProps, getCardImageProps } =
    usePaymentInputs();
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTab = window.open('', '_blank');

    setTimeout(() => {
      axios.post(`/api/orders/purchase/${cartId}`, null, { responseType: 'blob' }) // Set responseType to 'blob'
        .then(response => {
          if (response.status === 200) {
            alert('Payment Successful!');

            const blobUrl = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      
            if (newTab) {
              newTab.location.href = blobUrl;
            } else {
              alert('Unable to open a new tab. Please check your browser settings.');
            }

            if (onPaymentSuccess) onPaymentSuccess();
            
          } else {
            alert('Failed to process the order.');
          }
        })
        .catch(error => {
          console.error('Error posting order:', error);
          alert('Error processing order. Please try again.');

          if (newTab) newTab.close();
        });
    }, 1000);
  };

  return (
    <div style={formStyle}>
      <h2>Payment Details</h2>
      <form onSubmit={handleSubmit}>
        {/* Card Number Field */}
        <div {...wrapperProps} style={inputWrapperStyle}>
          <svg {...getCardImageProps({ images })} style={{ marginRight: '8px' }} />
          <input
            {...getCardNumberProps({
              onChange: handleInputChange,
              name: 'cardNumber',
              value: formData.cardNumber,
            })}
            style={inputStyle}
            placeholder="Card Number"
          />
        </div>

        {/* Expiry Date Field */}
        <input
          {...getExpiryDateProps({
            onChange: handleInputChange,
            name: 'expiryDate',
            value: formData.expiryDate,
          })}
          style={inputStyle}
          placeholder="MM/YY"
        />

        {/* CVC Field */}
        <input
          {...getCVCProps({
            onChange: handleInputChange,
            name: 'cvc',
            value: formData.cvc,
          })}
          style={inputStyle}
          placeholder="CVC"
        />

        {/* Submit Button */}
        <button type="submit" style={buttonStyle}>
          Process Payment
        </button>
      </form>
    </div>
  );
};

// Styles
const formStyle = {
  maxWidth: '400px',
  margin: '20px auto',
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
};

const inputWrapperStyle = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '10px',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  margin: '5px 0',
  border: '1px solid #ccc',
  borderRadius: '4px',
};

const buttonStyle = {
  width: '100%',
  padding: '10px',
  backgroundColor: '#007BFF',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default PaymentForm;
