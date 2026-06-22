// src/pages/CartPage.js - Shopping cart with quantity controls and order summary
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container">
        <h1>Shopping Cart</h1>
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <Link to="/" className="btn-primary" style={{ display: 'inline-block', width: 'auto', padding: '10px 24px' }}>
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Shopping Cart</h1>

      <div className="cart-layout">
        {/* Cart Items */}
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              {/* Image */}
              <div className="cart-item-image">
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <div className="image-placeholder">No Image</div>
                )}
              </div>

              {/* Name & Price */}
              <div className="cart-item-info">
                <Link to={`/products/${item._id}`} className="cart-item-name">
                  {item.name}
                </Link>
                <p className="cart-item-price">${item.price.toFixed(2)} each</p>
              </div>

              {/* Quantity Controls */}
              <div className="cart-item-qty">
                <button
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="qty-btn"
                >−</button>
                <span className="qty-value">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                  className="qty-btn"
                >+</button>
              </div>

              {/* Subtotal */}
              <div className="cart-item-subtotal">
                ${(item.price * item.quantity).toFixed(2)}
              </div>

              {/* Remove */}
              <button
                onClick={() => removeFromCart(item._id)}
                className="cart-item-remove"
                title="Remove item"
              >✕</button>
            </div>
          ))}

          {/* Clear Cart */}
          <button onClick={clearCart} className="btn-clear" style={{ marginTop: '12px' }}>
            Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Items ({cartItems.reduce((s, i) => s + i.quantity, 0)})</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span className="free-shipping">FREE</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <button className="btn-primary" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
          <Link to="/" className="continue-shopping">← Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
