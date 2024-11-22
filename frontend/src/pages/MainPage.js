import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import ShoppingCart from './ShoppingCart';
import logo from '../assets/BeyazEvim_logo.jpeg';

const MainPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  //const [subCategories, setSubCategories] = useState({});
  const [isCartHovered, setIsCartHovered] = useState(false);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [totalPrice, setTotalPrice] = useState(0.0);
  const [cartNum, setCartNum] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    //localStorage.clear();

    const token = Cookies.get('authToken');
    const userName = Cookies.get('userName');
    const userId = Cookies.get('userId');

    if (token) {
      setUserName(userName);

      axios.get(`/api/orders/${userId}/cart`)
        .then((response) => {
          const { id, totalPrice, orderItems } = response.data;
          Cookies.set('cartId', id, { expires: 7 });
          setTotalPrice(totalPrice);
          setCartNum(orderItems.length);
        })
        .catch((error) => {
          console.error('Error fetching categories:', error);
        });
    }
    else {
      const nonUserEmptyCart = { items: [], totalPrice: 0.0 };  
      const nonUserCart = JSON.parse(localStorage.getItem('cart')) || nonUserEmptyCart;
      setCartNum(nonUserCart.items.length);
      setTotalPrice(nonUserCart.totalPrice);
    }

    axios.get('/api/homepage')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the products!", error);
      });

    axios.get('/api/categories/root')
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
      
  }, []);

  useEffect(() => { 
    const userId = Cookies.get('userId');
    if (userId){
      axios.get(`/api/orders/${userId}/cart`)
          .then((response) => {
            const { id, totalPrice, orderItems } = response.data;
            Cookies.set('cartId', id, { expires: 7 });
            setTotalPrice(totalPrice);
            setCartNum(orderItems.length);
          })
          .catch((error) => {
            console.error('Error fetching shopping cart:', error);
          });
    }
    else {
      const nonUserEmptyCart = { items: [], totalPrice: 0.0 };  
      const nonUserCart = JSON.parse(localStorage.getItem('cart')) || nonUserEmptyCart;
      setCartNum(nonUserCart.items.length);
      setTotalPrice(nonUserCart.totalPrice);
    }
  }, [isCartVisible]);

  const handleLoginClick = () => {
    navigate('/signinsignup');
  };

  const handleUserPageClick = () => {
    navigate('/UserPage'); 
  };

  const handleCartClick = () => {
    setIsCartVisible(!isCartVisible);
  };

  const handleMouseEnter = (category) => {
    setHoveredCategory(category);
  };

  const handleMouseLeave = () => {
    setHoveredCategory(null);
  };

  const handleSubCategoryClick = (subcategoryId) => {
    navigate(`/category/${subcategoryId}`);
  };
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', display: 'flex' }}>
      {/* Sidebar Categories Section */}
      <div style={{ width: '250px' }}>
        <div style={logoContainerStyle}>
          <img src={logo} alt="BeyazEvim Logo" style={logoStyle} />
          <h3 style={logoTextStyle}>BeyazEvim</h3>
        </div>
        <nav style={sidebarStyle}>
          <h3>Categories</h3>
          {categories.map((category) => (
            <div
              key={category.id}
              onMouseEnter={() => handleMouseEnter(category)}
              onMouseLeave={handleMouseLeave}
              style={categoryStyle}
            >
              {category.categoryName}
              {hoveredCategory === category && category.subCategories.length > 0 && (
                <div style={dropdownStyle}>
                  {category.subCategories.map((subcategory) => (
                    <div
                      key={subcategory.id}
                      style={dropdownItemStyle}
                      onClick={() => handleSubCategoryClick(subcategory.id)}
                    >
                      {subcategory.categoryName}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1 }}>
        {/* Header Section */}
        <header style={headerStyle}>
          <div style={logoStyle}>BeyazEvim</div>
          <input
            type="text"
            placeholder="What are you looking for?"
            style={searchBarStyle}
          />
          <div style={navIconsStyle}>
            {userName ? (
              <button
                onClick={handleUserPageClick} // Navigate to User Page
                style={navButtonStyle}
              >
                {userName}
              </button>
            ) : (
              <button onClick={handleLoginClick} style={navButtonStyle}>
                Login
              </button>
            )}
            <div style={cartContainerStyle}>
              <div
                style={isCartHovered ? hoveredCartIconStyle : cartIconStyle}
                onMouseEnter={() => setIsCartHovered(true)}
                onMouseLeave={() => setIsCartHovered(false)}
                onClick={handleCartClick}
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

        {/* Cart Overlay and Dropdown */}
        {isCartVisible && (
          <>
            {/* Blur Overlay */}
            <div
              style={cartOverlayStyle}
              onClick={handleCartClick} // Close the cart if overlay is clicked
            ></div>
            {/* Cart Dropdown */}
            <div style={cartDropdownStyle}>
              <ShoppingCart onClose={handleCartClick} />
            </div>
          </>
        )}
        
        {/* Product Grid */}
        <div style={{ padding: '20px' }}>
          <h1>BeyazEvim - Your White Goods Store</h1>
          <div style={productGridStyle}>
            {products.map((product) => (
              <div key={product.id} style={productCardStyle} onClick={()=> handleProductClick(product.id)}>
                <img
                  src={product.image || 'https://via.placeholder.com/150'}
                  alt={product.name}
                  style={{ width: '100%', borderRadius: '10px' }}
                />
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <hr></hr>
                <p style={{ fontWeight: 'bold', color: product.stockCount > 0 ? 'inherit' : 'red' }}>
                  {product.stockCount > 0 ? `₺${product.price}` : 'OUT OF STOCK'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


// CSS Styles as JavaScript objects
const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 20px',
  backgroundColor: '#333',
  color: 'white',
};

const logoStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
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

const navButtonStyle = {
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease, color 0.3s ease',
  minWidth: '100px',
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '40px',
};

const sidebarStyle = {
  width: '250px',
  padding: '20px',
  borderRight: '1px solid #ddd',
  backgroundColor: '#f5f5f5',
};

const categoryStyle = {
  position: 'relative',
  padding: '10px 0',
  cursor: 'pointer',
  color: '#333',
};

const dropdownStyle = {
  position: 'absolute',
  left: '100%',
  top: 0,
  backgroundColor: 'white',
  boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
  padding: '10px',
  borderRadius: '5px',
  zIndex: 1,
  minWidth: '200px',
};

const dropdownItemStyle = {
  padding: '5px 10px',
  cursor: 'pointer',
  color: '#333',
  whiteSpace: 'nowrap',
};


const cartDropdownStyle = {
  position: 'absolute',
  top: '0', 
  right: '0', 
  width: '30%', 
  height: '100vh', 
  backgroundColor: 'white',
  boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.2)', 
  padding: '20px', 
  zIndex: 100,
  borderRadius: '0', 
  transition: 'width 0.3s ease-in-out', 
};

const cartOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.4)', 
  zIndex: 99, 
  transition: 'opacity 0.3s ease-in-out',
};

const productGridStyle = {
  display: 'flex',
  gap: '20px',
  flexWrap: 'wrap',
};

const productCardStyle = {
  border: '1px solid #ddd',
  borderRadius: '10px',
  padding: '10px',
  width: '200px',
  textAlign: 'center',
  cursor: 'pointer',
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
  transition: 'background-color 0.3s ease',
};

const hoveredCartIconStyle = {
  ...cartIconStyle,
  backgroundColor: 'red', // Change background color on hover
};

const cartTextStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  fontSize: '14px',
  cursor: 'default',
};

const cartItemCountStyle = {
  color: 'white',
  fontWeight: 'bold',
};

const cartPriceStyle = {
  fontSize: '12px',
  color: 'white',
};

export default MainPage;
