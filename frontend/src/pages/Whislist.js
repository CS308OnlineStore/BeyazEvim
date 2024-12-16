import React, { useState, useEffect } from 'react';
import { Table, Button, Image, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import axios from 'axios';

const { Title } = Typography;

const Wishlist = () => {

  const [wishlist, setWishlist] = useState([]);
  const [userID, setUserID] = useState([]);

  const userId = Cookies.get('userId');
  setUserID(userId);

  useEffect(() => {
    
    fetchWishlist(userID);
  }, [userID]);

  const fetchWishlist = (userID) => {
    axios.get(`/api/users/${userID}/wishlist`)
        .then((response) => setWishlist(response.data))
        .catch((error) => console.error('Error fetching wishlist:', error));
  }

  const removeFromWishlist = (productModelId) => {
    axios.get(`/api/users/${userID}/wishlist/${productModelId}`)
        .then(response => {
            if (response.status === 200) {
                alert("Successfully removed item from wishlist!");
              }
              else { alert("Failed to remove item from wishlist!"); }
        })
        .catch((error) => console.error('Error removing item from wishlist:', error));
  }

  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src={record.imagePath || 'https://via.placeholder.com/50'}
            alt={name}
            width={50}
            height={50}
          />
          <span style={{ marginLeft: '10px' }}>{name}</span>
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `${price.toLocaleString()} TL`,
    },
    {
      title: '',
      key: 'action',
      render: (record) => (
        <Button
          type="primary"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeFromWishlist(record.id)}
        >
          Remove
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Title level={3}>Wishlist</Title>
      <Table
        dataSource={wishlist}
        columns={columns}
        rowKey="id"
        bordered
        pagination={false}
      />
    </div>
  );
};

export default Wishlist;