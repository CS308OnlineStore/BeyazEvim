import React, { useState, useEffect } from 'react';
import { Table, Button, Image, Typography, Tooltip, Popconfirm, Empty, Spin, Breadcrumb } from 'antd';
import { DeleteOutlined, HomeOutlined, HeartOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import axios from 'axios';

const { Title } = Typography;

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [userID, setUserID] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = Cookies.get('userId');
    if (userId) {
      setUserID(userId);
      fetchWishlist(userId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchWishlist = async (userId) => {
    try {
      const response = await axios.get(`/api/users/${userId}/wishlist`);
      setWishlist(response.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productModelId) => {
    try {
      const response = await axios.delete(`/api/users/${userID}/wishlist/${productModelId}`);
      if (response.status === 200) {
        setWishlist(wishlist.filter(item => item.id !== productModelId));
      } else {
        alert('Failed to remove item from wishlist!');
      }
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
    }
  };

  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src={record.image_path === '/images/default.jpg' ? '/assets/Image_placeholder.jpg' : record.image_path} 
            alt={name}
            width={50}
            height={50}
            preview
          />
          <span style={{ marginLeft: '10px' }}>{name}</span>
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      align: 'right',
      render: (price) => `${price.toLocaleString()} TL`,
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (record) => (
        <Popconfirm
          title="Are you sure you want to remove this item from your wishlist?"
          onConfirm={() => removeFromWishlist(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Tooltip title="Remove from wishlist">
            <Button type="primary" danger icon={<DeleteOutlined />} />
          </Tooltip>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Breadcrumb>
        <Breadcrumb.Item href="/">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <HeartOutlined />
          <span>Wishlist</span>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Title level={3} style={{ margin: '20px 0' }}>Wishlist</Title>
      <Spin spinning={loading}>
        {wishlist.length > 0 ? (
          <Table
            dataSource={wishlist}
            columns={columns}
            rowKey="id"
            bordered
            pagination={false}
          />
        ) : (
          <Empty description="Your wishlist is empty" />
        )}
      </Spin>
    </div>
  );
};

export default Wishlist;
