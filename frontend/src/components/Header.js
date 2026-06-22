import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">🛒 ShopNow</Link>
        <nav className="nav">
          <Link to="/">Products</Link>
          {user ? (
            <>
              <Link to="/orders">My Orders</Link>
              {user.role === 'admin' && <Link to="/admin">Admin</Link>}
              <Link to="/cart" className="cart-link">
                Cart {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
              </Link>
              <span className="nav-user">Hi, {user.name.split(' ')[0]}</span>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/cart" className="cart-link">
                Cart {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
              </Link>
              <Link to="/login" className="btn btn-sm">Login</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;