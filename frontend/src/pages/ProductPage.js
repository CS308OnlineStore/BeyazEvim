// src/pages/ProductPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import newLogo from '../assets/BeyazEvim_new_logo.jpeg';


const ProductPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [productDetails, setProductDetails] = useState(null);
  const [count, setCount] = useState(1);
  const [isCartHovered, setIsCartHovered] = useState(false);
  const [cartNum, setCartNum] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0.0);

  //comment rating 
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newRating, setNewRating] = useState(0);
  const ratingTitles = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };
  

  useEffect(() => {
    axios.get(`/api/product-models/${id}`)
      .then(response => {
        setProductDetails(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the product details!", error);
      });

    
    axios.get(`/api/comments/products/${id}`)
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
      });

    const userId = Cookies.get('userId');
    if (userId) {
      axios.get(`/api/orders/${userId}/cart`)
        .then((response) => {
          const { orderItems, totalPrice } = response.data;
          setCartNum(orderItems.length);
          setTotalPrice(totalPrice);
        })
        .catch((error) => {
          console.error('Error fetching cart details:', error);
        });
    } else {
      const nonUserCart = JSON.parse(localStorage.getItem('cart')) || { items: [], totalPrice: 0.0 };
      setCartNum(nonUserCart.items.length);
      setTotalPrice(nonUserCart.totalPrice);
    }
  }, [id]);

  const handleIncrease = () => {
    if (count < productDetails.stockCount) {
      setCount(prevCount => prevCount + 1);
    }
  };

  const handleDecrease = () => {
    if (count > 1) {
      setCount(prevCount => prevCount - 1);
    }
  };

  const handleAddToCart = async () => {
    const cartId = Cookies.get('cartId');
    
    if (cartId) {
      for (let i = 0; i < count; i++) {
        try {
          const response = await axios.post(`/api/order-items/add?orderId=${cartId}&productModelId=${id}`);
          if (response.status === 200 && i === count - 1) {
            alert('Successfully added to cart!');
          } 
        } catch (error) {
          console.error("There was an error fetching the product details!", error);
          if ( i === 0 ) { alert(`Failed to add ${count} items to cart!`); }
          else { alert(`Only ${i} items added to cart!`); }
          break; 
        }
      }
    }
    else {
      const nonUserEmptyCart = { items: [], totalPrice: 0.0 };  
      const nonUserCart = JSON.parse(localStorage.getItem('cart')) || nonUserEmptyCart;
      const itemsDetail = { "productModel" : productDetails, "quantity" : parseInt(`${count}`) }
      if ( nonUserCart.items.length === 0 ){
        nonUserCart.items.push(itemsDetail);
        nonUserCart.totalPrice += ( productDetails.price * count );
      }
      else {
        let match = false;
        for ( let i=0; i<nonUserCart.items.length; i++ ) {
          if ( productDetails.id === nonUserCart.items[i].productModel.id ) { 
            nonUserCart.items[i].quantity += count;
            nonUserCart.totalPrice += ( productDetails.price * count );
            match = true;  
            break;        
          }
        };
        if ( !match ) {
          nonUserCart.items.push(itemsDetail);
          nonUserCart.totalPrice += ( productDetails.price * count ); 
        }        
      }   
      localStorage.setItem('cart', JSON.stringify(nonUserCart));
      alert('Successfully added to cart!');
    }
    navigate('/');
  }

  const handleLogoClick = () => {
    navigate('/'); // Navigate to MainPage
  };
  
  const handleAddToWishlist = () => {
    const userId = Cookies.get('userId');
    if (userId) {
      axios.post(`/api/users/${userId}/wishlist/${id}`)
        .then(response => {
          if (response.status === 200) {
            alert('Successfully added to wishlist!');
          } else { alert("Failed to add item to wishlist!"); }
          })
          .catch((error) => console.error('Error adding item to wishlist:', error));
    } else { 
      alert('Please SignIn before using wishlist!')
      navigate('/signinsignup')
    }
  };

  const handleAddComment = async () => {
    const userId = Cookies.get('userId');
    if (!userId) {
      alert('You need to log in to leave a comment.');
      return;
    }

    try {
      const response = await axios.get(`/api/orders/user/${userId}`);
      const filteredOrders = response.data.filter(order => order.status !== "CART");
      
      const purchasedProductIds = filteredOrders.flatMap(order =>
        order.orderItems.map(item => item.productModel.id)
    );

      if (!purchasedProductIds.includes(parseInt(id))) {
          alert("You need to have bought the item to leave a comment.");
          return;
      }
    } catch (error) {
        console.error("Error fetching orders:", error);
        alert("An error occurred while verifying your purchase.");
        return;
    }

    if ( newRating <= 0 ) {
        alert('Please provide a rating.');
        return;
    }

    const commentData = {
      title: newTitle,
      rating: newRating,
      text: newComment,
  };
  
  try{
    await axios.post(`/api/comments/users/${userId}/products/${id}`, commentData);
    alert("Thank you for comment!");
    window.location.reload();
  } catch (error) {
      console.error("Error adding comment:", error);
  }
  };


  if (!productDetails) {
    return <p>Loading product details...</p>;
  }

  return (
    <div>
      {/* Header Section */}
      <header style={headerStyle}>
        <div style={{ ...headerLeftStyle, cursor: 'pointer' }} onClick={handleLogoClick}>
          <img src={newLogo} alt="BeyazEvim Logo" style={logoStyle} />
          <h3 style={logoTextStyle}>BeyazEvim</h3>
        </div>
        <input
          type="text"
          placeholder="What are you looking for?"
          style={searchBarStyle}
        />
        <div style={navIconsStyle}>
          <div style={cartContainerStyle}>
            <div
              style={isCartHovered ? hoveredCartIconStyle : cartIconStyle}
              onMouseEnter={() => setIsCartHovered(true)}
              onMouseLeave={() => setIsCartHovered(false)}
            >
              <span role="img" aria-label="cart">
                🛒
              </span>
            </div>
            <div style={cartTextStyle}>
              <span style={cartPriceStyle}>Sepetim ({cartNum})</span>
              <br />
              <span style={cartItemCountStyle}>{totalPrice} TL</span>
            </div>
          </div>
        </div>
      </header>
  
      {/* Product Details Section */}
      <div style={productDetailsContainerStyle}>
        <div style={productDetailsStyle}>
          <img
            src={productDetails.image_path}
            alt={productDetails.name}
            style={{ width: '150px', height: '150px', borderRadius: '10px' }}
          />
          <h1>{productDetails.name}</h1>
          <p>{productDetails.description}</p>
          <p style={{ fontWeight: 'bold' }}>₺{productDetails.price}</p>
          {productDetails.stockCount > 0 && <p>In Stock : {productDetails.stockCount}</p>}
  
          {/* Counter Component */}
          {productDetails.stockCount > 0 ? (
            <div style={counterStyle}>
              <button onClick={handleDecrease} style={buttonStyle}>-</button>
              <span style={countStyle}>{count}</span>
              <button onClick={handleIncrease} style={buttonStyle}>+</button>
            
              {/* Add to Wishlist Button */}
              <button
                style={wishlistButtonStyle}
                onClick={handleAddToWishlist}
              >
                Add to Wishlist
              </button>
            </div>
          ) : (
            <p style={{ color: 'red', marginBottom: '10px' }}>Out of Stock</p>
          )}
  
          {/* Add to Cart Button */}
          {productDetails.stockCount > 0 ? (
            <button style={cartButtonStyle} onClick={handleAddToCart}>
              Add to Cart
            </button>
          ) : (
            <button style={cartButtonStyle} onClick={handleAddToWishlist}>
              Add to Wishlist
            </button>
          )}
        </div>
      </div>

      <div style={commentSectionStyle}> 
          <h3>Total Rating: {productDetails.rating ? `${productDetails.rating}/5` : "No rating yet"}</h3>
      </div>
      
      {/* Comments Section */}
      <div style={commentSectionStyle}>
        <h3>Comments</h3>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} style={commentCardStyle}>
              <p>
                <span style={userNameStyle}>User {comment.user.id}:</span> {comment.text}
              </p>
              <p>Rating: {comment.rating} / 5</p>
              <p style={commentDateStyle}>
                {new Date(comment.createdDate).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p>No comments yet. Be the first to leave one!</p>
        )}
      </div>

      <div style={commentSectionStyle}>
        <h3>Leave a Comment</h3>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write your comment here"
          style={commentInputStyle}
        />
        <div>
          <label>Rating:</label>
          <select
            value={newRating}
            onChange={(e) => {
              const selectedRating = parseInt(e.target.value, 10);
              setNewRating(selectedRating);
              setNewTitle(ratingTitles[selectedRating]);
            }}
            style={ratingSelectStyle}
          >
            <option value="0">Select a rating</option>
            <option value="1">1 - Poor</option>
            <option value="2">2 - Fair</option>
            <option value="3">3 - Good</option>
            <option value="4">4 - Very Good</option>
            <option value="5">5 - Excellent</option>
          </select>
        </div>
        <button onClick={handleAddComment} style={submitButtonStyle}>
          Submit
        </button>
      </div>
    </div>
  );
}

// CSS styles
const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 20px',
  backgroundColor: '#333',
  color: 'white',
};

const headerLeftStyle = {
  display: 'flex',
  alignItems: 'center',
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

const searchBarStyle = {
  width: '50%',
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ddd',
};

const navIconsStyle = {
  display: 'flex',
  alignItems: 'center',
};

const cartContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '10px',
  color: 'white',
};

const cartIconStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  backgroundColor: '#333',
  borderRadius: '50%',
  fontSize: '20px',
  color: 'white',
  marginRight: '10px',
  cursor: 'pointer',
};

const hoveredCartIconStyle = {
  ...cartIconStyle,
  backgroundColor: 'red',
};

const cartTextStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  fontSize: '14px',
};

const cartPriceStyle = {
  fontSize: '12px',
  color: 'white',
};

const cartItemCountStyle = {
  color: 'white',
  fontWeight: 'bold',
};

const productDetailsContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  padding: '20px',
};

const productDetailsStyle = {
  padding: '20px',
  textAlign: 'center',
};

const counterStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  marginTop: '20px',
};

const buttonStyle = {
  width: '40px',
  height: '40px',
  fontSize: '20px',
  fontWeight: 'bold',
  borderRadius: '5px',
  border: '1px solid #ccc',
  cursor: 'pointer',
  backgroundColor: '#f8f8f8',
};

const countStyle = {
  fontSize: '20px',
  fontWeight: 'bold',
};

const cartButtonStyle = {
  marginTop: '20px',
  padding: '10px 20px',
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#fff',
  backgroundColor: '#007BFF',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const commentSectionStyle = {
  padding: '20px',
  marginTop: '20px',
  borderTop: '1px solid #ddd',
};

const commentInputStyle = {
  width: '100%',
  height: '80px',
  padding: '10px',
  marginBottom: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  resize: 'none',
};

const ratingSelectStyle = {
  marginLeft: '10px',
  padding: '5px',
  borderRadius: '5px',
  border: '1px solid #ccc',
};

const submitButtonStyle = {
  marginTop: '10px',
  padding: '10px 20px',
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#fff',
  backgroundColor: '#007BFF',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
};

const commentCardStyle = {
  marginBottom: '10px',
  borderBottom: '1px solid #ddd',
  paddingBottom: '10px',
};

const userNameStyle = {
  fontWeight: 'bold',
};

const commentDateStyle = {
  fontStyle: 'italic',
  fontSize: '12px',
  color: '#888',
};

const wishlistButtonStyle = {
  padding: '10px 20px',
  backgroundColor: '#f5a623',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginLeft: '10px',
  fontSize: '14px',
};

export default ProductPage;
