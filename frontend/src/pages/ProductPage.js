// src/pages/ProductPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  Layout,
  Input,
  Button,
  Card,
  Rate,
  List,
  Form,
  Select,
  notification,
  Badge,
  Tooltip,
} from 'antd';
import {
  ShoppingCartOutlined,
  HeartOutlined,
  HomeOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import newLogo from '../assets/BeyazEvim_new_logo.jpeg';
import 'antd/dist/reset.css'; // Updated for Ant Design v5

const { Header, Content } = Layout;
const { TextArea } = Input;
const { Option } = Select;

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productDetails, setProductDetails] = useState(null);
  const [count, setCount] = useState(1);
  const [cartNum, setCartNum] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0.0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newRating, setNewRating] = useState(0);
  const ratingTitles = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
  };

  useEffect(() => {
    // Fetch product details
    axios
      .get(`/api/product-models/${id}`)
      .then((response) => {
        setProductDetails(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the product details!', error);
      });

    // Fetch comments
    axios
      .get(`/api/comments/products/${id}`)
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => {
        console.error('Error fetching comments:', error);
      });

    // Fetch cart details
    const userId = Cookies.get('userId');
    if (userId) {
      axios
        .get(`/api/orders/${userId}/cart`)
        .then((response) => {
          const { orderItems, totalPrice } = response.data;
          setCartNum(orderItems.length);
          setTotalPrice(totalPrice);
        })
        .catch((error) => {
          console.error('Error fetching cart details:', error);
        });
    } else {
      const nonUserCart =
        JSON.parse(localStorage.getItem('cart')) || { items: [], totalPrice: 0.0 };
      setCartNum(nonUserCart.items.length);
      setTotalPrice(nonUserCart.totalPrice);
    }
  }, [id]);

  const handleIncrease = () => {
    if (count < productDetails.stockCount) {
      setCount((prevCount) => prevCount + 1);
    }
  };

  const handleDecrease = () => {
    if (count > 1) {
      setCount((prevCount) => prevCount - 1);
    }
  };

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: 'topRight',
    });
  };

  const handleAddToCart = async () => {
    const cartId = Cookies.get('cartId');

    if (cartId) {
      for (let i = 0; i < count; i++) {
        try {
          const response = await axios.post(
            `/api/order-items/add?orderId=${cartId}&productModelId=${id}`
          );
          if (response.status === 200 && i === count - 1) {
            openNotification('success', 'Success', 'Successfully added to cart!');
          }
        } catch (error) {
          console.error('There was an error adding to cart!', error);
          if (i === 0) {
            openNotification(
              'error',
              'Error',
              `Failed to add ${count} items to cart!`
            );
          } else {
            openNotification(
              'warning',
              'Partial Success',
              `Only ${i} items added to cart!`
            );
          }
          break;
        }
      }
    } else {
      const nonUserEmptyCart = { items: [], totalPrice: 0.0 };
      const nonUserCart =
        JSON.parse(localStorage.getItem('cart')) || nonUserEmptyCart;
      const itemsDetail = { productModel: productDetails, quantity: parseInt(`${count}`) };
      if (nonUserCart.items.length === 0) {
        nonUserCart.items.push(itemsDetail);
        nonUserCart.totalPrice += productDetails.price * count;
      } else {
        let match = false;
        for (let i = 0; i < nonUserCart.items.length; i++) {
          if (productDetails.id === nonUserCart.items[i].productModel.id) {
            nonUserCart.items[i].quantity += count;
            nonUserCart.totalPrice += productDetails.price * count;
            match = true;
            break;
          }
        }
        if (!match) {
          nonUserCart.items.push(itemsDetail);
          nonUserCart.totalPrice += productDetails.price * count;
        }
      }
      localStorage.setItem('cart', JSON.stringify(nonUserCart));
      openNotification('success', 'Success', 'Successfully added to cart!');
    }
    navigate('/');
  };

  const handleLogoClick = () => {
    navigate('/'); // Navigate to MainPage
  };

  const handleAddToWishlist = () => {
    const userId = Cookies.get('userId');
    if (userId) {
      axios
        .post(`/api/users/${userId}/wishlist/${id}`)
        .then((response) => {
          if (response.status === 200) {
            openNotification('success', 'Success', 'Successfully added to wishlist!');
          } else {
            openNotification('error', 'Error', 'Failed to add item to wishlist!');
          }
        })
        .catch((error) => {
          console.error('Error adding item to wishlist:', error);
          openNotification(
            'error',
            'Error',
            'An error occurred while adding to wishlist.'
          );
        });
    } else {
      openNotification(
        'warning',
        'Authentication Required',
        'Please sign in before using the wishlist!'
      );
      navigate('/signinsignup');
    }
  };

  const handleAddComment = async () => {
    const userId = Cookies.get('userId');
    if (!userId) {
      openNotification(
        'warning',
        'Authentication Required',
        'You need to log in to leave a comment.'
      );
      return;
    }

    try {
      const response = await axios.get(`/api/orders/user/${userId}`);
      const filteredOrders = response.data.filter(
        (order) => order.status !== 'CART'
      );

      const purchasedProductIds = filteredOrders.flatMap((order) =>
        order.orderItems.map((item) => item.productModel.id)
      );

      if (!purchasedProductIds.includes(parseInt(id))) {
        openNotification(
          'warning',
          'Permission Denied',
          'You need to have bought the item to leave a comment.'
        );
        return;
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      openNotification(
        'error',
        'Error',
        'An error occurred while verifying your purchase.'
      );
      return;
    }

    if (newRating <= 0) {
      openNotification(
        'warning',
        'Validation Error',
        'Please provide a rating.'
      );
      return;
    }

    const commentData = {
      title: newTitle,
      rating: newRating,
      text: newComment,
    };

    try {
      await axios.post(
        `/api/comments/users/${userId}/products/${id}`,
        commentData
      );
      openNotification('success', 'Thank You!', 'Thank you for your comment!');
      window.location.reload();
    } catch (error) {
      console.error('Error adding comment:', error);
      openNotification('error', 'Error', 'Failed to add comment.');
    }
  };

  if (!productDetails) {
    return (
      <Layout>
        <Header>
          <div
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={handleLogoClick}
          >
            <img
              src={newLogo}
              alt="BeyazEvim Logo"
              style={{ width: '50px', marginRight: '10px' }}
            />
            <h3 style={{ color: 'white' }}>BeyazEvim</h3>
          </div>
        </Header>
        <Content style={{ padding: '50px', textAlign: 'center' }}>
          <h2>Loading product details...</h2>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header Section */}
      <Header
        style={{
          position: 'fixed',
          zIndex: 1,
          width: '100%',
          backgroundColor: '#001529',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          {/* Logo */}
          <div
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={handleLogoClick}
          >
            <img
              src={newLogo}
              alt="BeyazEvim Logo"
              style={{ width: '50px', marginRight: '10px' }}
            />
            <h3 style={{ color: '#fff' }}>BeyazEvim</h3>
          </div>

          {/* Search Bar */}
          <Input.Search
            placeholder="What are you looking for?"
            onSearch={(value) => console.log(value)}
            style={{ width: '40%' }}
            allowClear
            enterButton={<SearchOutlined />}
          />

          {/* Navigation Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Tooltip title="Home">
              <HomeOutlined
                style={{ color: '#fff', fontSize: '20px', cursor: 'pointer' }}
                onClick={handleLogoClick}
              />
            </Tooltip>
            <Tooltip title="Wishlist">
              <HeartOutlined
                style={{ color: '#fff', fontSize: '20px', cursor: 'pointer' }}
                onClick={handleAddToWishlist}
              />
            </Tooltip>
            <Tooltip title="Cart">
              <Badge count={cartNum} showZero>
                <ShoppingCartOutlined
                  style={{ color: '#fff', fontSize: '20px', cursor: 'pointer' }}
                />
              </Badge>
            </Tooltip>
          </div>
        </div>
      </Header>

      {/* Main Content */}
      <Content style={{ padding: '100px 50px' }}>
        <Card
          hoverable
          style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}
          cover={
            <img
              alt={productDetails.name}
              src={productDetails.image_path}
              style={{ objectFit: 'cover', height: '400px' }}
            />
          }
        >
          <h1>{productDetails.name}</h1>
          <Rate disabled value={productDetails.rating || 0} />
          <span style={{ marginLeft: '10px' }}>
            {productDetails.rating ? `${productDetails.rating}/5` : 'No rating yet'}
          </span>
          <p style={{ marginTop: '20px' }}>{productDetails.description}</p>
          <h2 style={{ color: '#1890ff' }}>₺{productDetails.price}</h2>
          {productDetails.stockCount > 0 ? (
            <p style={{ color: 'green' }}>In Stock: {productDetails.stockCount}</p>
          ) : (
            <p style={{ color: 'red' }}>Out of Stock</p>
          )}

          {/* Quantity Selector and Wishlist Button */}
          {productDetails.stockCount > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '20px',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button onClick={handleDecrease} disabled={count <= 1}>
                  -
                </Button>
                <Input
                  style={{
                    width: '60px',
                    textAlign: 'center',
                    margin: '0 5px',
                  }}
                  value={count}
                  readOnly
                />
                <Button
                  onClick={handleIncrease}
                  disabled={count >= productDetails.stockCount}
                >
                  +
                </Button>
              </div>
              <Button
                type="default"
                icon={<HeartOutlined />}
                onClick={handleAddToWishlist}
              >
                Add to Wishlist
              </Button>
            </div>
          )}

          {/* Add to Cart Button */}
          {productDetails.stockCount > 0 ? (
            <Button
              type="primary"
              block
              style={{ marginTop: '20px' }}
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          ) : (
            <Button
              type="default"
              block
              style={{ marginTop: '20px' }}
              onClick={handleAddToWishlist}
            >
              Add to Wishlist
            </Button>
          )}
        </Card>

        {/* Comments Section */}
        <div style={{ marginTop: '50px' }}>
          <h2>
            Total Rating:{' '}
            {productDetails.rating ? `${productDetails.rating}/5` : 'No rating yet'}
          </h2>

          <List
            header={<div>Comments</div>}
            bordered
            dataSource={comments}
            locale={{ emptyText: 'No comments yet. Be the first to leave one!' }}
            renderItem={(comment) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <div>
                      <strong>User {comment.user.id}</strong>{' '}
                      <Rate disabled defaultValue={comment.rating} style={{ fontSize: '14px' }} />
                    </div>
                  }
                  description={comment.text}
                />
                <div>{new Date(comment.createdDate).toLocaleString()}</div>
              </List.Item>
            )}
          />

          {/* Add Comment Form */}
          <Card title="Leave a Comment" style={{ marginTop: '20px' }}>
            <Form layout="vertical">
              <Form.Item label="Comment" required>
                <TextArea
                  rows={4}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write your comment here"
                />
              </Form.Item>
              <Form.Item label="Rating" required>
                <Select
                  placeholder="Select a rating"
                  value={newRating || undefined}
                  onChange={(value) => {
                    setNewRating(value);
                    setNewTitle(ratingTitles[value]);
                  }}
                >
                  <Option value={1}>1 - Poor</Option>
                  <Option value={2}>2 - Fair</Option>
                  <Option value={3}>3 - Good</Option>
                  <Option value={4}>4 - Very Good</Option>
                  <Option value={5}>5 - Excellent</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={handleAddComment}>
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default ProductPage;
