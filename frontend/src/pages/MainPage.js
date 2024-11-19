import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import ShoppingCart from './ShoppingCart';
import logo from '../assets/BeyazEvim_logo.jpeg'; // Ensure the path is correct

const MainPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [subCategories, setSubCategories] = useState({});
  const [isCartHovered, setIsCartHovered] = useState(false);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [totalPrice, setTotalPrice] = useState(0.0);
  const [cartNum, setCartNum] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const token = Cookies.get('authToken');
    const userName = Cookies.get('userName');
    const totalPrice = parseFloat(Cookies.get('totalPrice')).toFixed(2);
    const cartNum = Cookies.get('cartNum');

    if (token) {
      setUserName(userName);
      setTotalPrice(totalPrice);
      setCartNum(cartNum);
    }

    axios.get('/api/homepage')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the products!", error);
      });

    // Fetch categories
    axios
      .get('/api/categories/root')
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  const fetchSubCategories = (categoryId) => {
    if (!subCategories[categoryId]) {
      axios
        .get(`/api/categories/${categoryId}/subcategories`)
        .then((response) => {
          setSubCategories((prev) => ({
            ...prev,
            [categoryId]: response.data,
          }));
        })
        .catch((error) => {
          console.error('Error fetching subcategories:', error);
        });
    }
  };

  const handleLoginClick = () => {
    navigate('/signinsignup');
  };

  const handleLogoutClick = () => {
    Object.keys(Cookies.get()).forEach((cookieName) => {
      Cookies.remove(cookieName);
    });
    setUserName('');
    navigate('/');
  };

  const handleCartClick = () => {
    setIsCartVisible(!isCartVisible);
    const totalPrice = parseFloat(Cookies.get('totalPrice')).toFixed(2);
    const cartNum = Cookies.get('cartNum');

    setTotalPrice(totalPrice);
    setCartNum(cartNum);
  };

  const handleMouseEnter = (category) => {
    setHoveredCategory(category);
    fetchSubCategories(category.id); // Fetch subcategories on hover
  };

  const handleMouseLeave = () => {
    setHoveredCategory(null);
  };

  const handleSubCategoryClick = (subcategoryId) => {
    navigate(`/category/${subcategoryId}`);
  };
  const handleProductClick = (productId) => {
    navigate('/product/${productId}');
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
              {category.name}
              {hoveredCategory === category && subCategories[category.id] && (
                <div style={dropdownStyle}>
                  {subCategories[category.id].map((subcategory) => (
                    <div
                      key={subcategory.id}
                      style={dropdownItemStyle}
                      onClick={() => handleSubCategoryClick(subcategory.id)}
                    >
                      {subcategory.name}
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
          <input
            type="text"
            placeholder="What are you looking for?"
            style={searchBarStyle}
          />
          <div style={navIconsStyle}>
            {userName ? (
              <div
                onClick={handleLogoutClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={isHovered ? hoveredButtonStyle : navButtonStyle}
              >
                {isHovered ? 'Logout' : userName}
              </div>
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

        {/* Cart Dropdown */}
        {isCartVisible && (
          <div style={cartDropdownStyle}>
            <ShoppingCart />
          </div>
        )}

        {/* Product Grid */}
        <div style={{ padding: '20px' }}>
          <h1>BeyazEvim - Your White Goods Store</h1>
          <div style={productGridStyle}>
            {/* Example content for products */}
            {products.map((product) => (
              <div key={product.id} style={productCardStyle} onClick={()=> handleProductClick(product.id)}>
                <img
                  src={product.image || 'https://via.placeholder.com/150'}
                  alt={product.name}
                  style={{ width: '100%', borderRadius: '10px' }}
                />
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p style={{ fontWeight: 'bold' }}>₺{product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


// CSS Styles as JavaScript objects
const logoContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '20px',
  borderBottom: '1px solid #ddd',
  justifyContent: 'center',
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

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 20px',
  backgroundColor: '#333',
  color: 'white',
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

const hoveredButtonStyle = {
  ...navButtonStyle,
  backgroundColor: 'red',
  color: 'white',
};

const sidebarStyle = {
  padding: '20px',
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
  top: '60px',
  right: '20px',
  width: '300px',
  backgroundColor: 'white',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  padding: '10px',
  zIndex: 100,
  borderRadius: '5px',
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
