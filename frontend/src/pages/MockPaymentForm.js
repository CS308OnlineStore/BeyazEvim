import React, { useState } from 'react';
import { usePaymentInputs } from 'react-payment-inputs';
import images from 'react-payment-inputs/images';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';

const PaymentForm = ({ onPaymentSuccess }) => {
  const cartId = Cookies.get('cartId');
  const navigate = useNavigate();

  const { getCardNumberProps, getExpiryDateProps, getCVCProps, wrapperProps, getCardImageProps } =
    usePaymentInputs();
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(async () => {
      try {
        const response = await axios.post(`/api/orders/purchase/${cartId}`, null, {
          responseType: 'blob',
        });

        if (response.status === 200) {
          notification.success({
            message: 'Payment Successful',
            description: 'Your payment has been successfully processed! The receipt will open in a new tab.',
            placement: 'topRight'
          });

          const fileURL = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
          window.open(fileURL, '_blank');

          window.location.reload();

          if (onPaymentSuccess) {
            onPaymentSuccess();
          }
        } else {
          notification.error({
            message: 'Payment Failed',
            description: 'Unable to process your payment. Please try again later.',
            placement: 'topRight'
          });
        }
      } catch (error) {
        setLoading(false);
        console.error('Error posting order:', error);
        notification.error({
          message: 'Order Error',
          description: 'An error occurred while processing your order. Please try again.',
          placement: 'topRight'
        });
      }
    }, 500);
  };

  if (loading) {
    // Show loading screen while waiting
    return (
      <div style={loadingStyle}>
        <img
          src="/assets/loadingGif.gif"
          alt="Loading..."
          style={loadingImageStyle}
        />
        <p>Waiting for approval from your bank...</p>
      </div>
    );
  }

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

const loadingStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  margin: '20px auto',
  border: '1px solid #ccc',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  backgroundColor: '#fff',
  width: 'fit-content',
};

const loadingImageStyle = {
  width: '100px',
  height: '100px',
  marginBottom: '20px',
};

export default PaymentForm;