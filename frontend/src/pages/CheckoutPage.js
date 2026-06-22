// src/pages/CheckoutPage.js - Shipping address form + place order
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api/axios';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect to cart if there are no items (useEffect avoids navigating during render)
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const orderData = {
        items: cartItems.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
        shippingAddress: { address, city, postalCode, country },
      };

      console.debug('Placing order payload:', orderData);

      const response = await api.post('/orders', orderData);
      console.debug('Place order response:', response.status, response.data);

      // clear cart locally
      clearCart();

      // If server returned an order id navigate to its page, otherwise go to orders list
      const data = response.data;
      if (data && data._id) {
        navigate(`/orders/${data._id}`);
      } else {
        navigate('/orders');
      }
    } catch (err) {
      console.error('Order creation failed:', err);
      setError(err.response?.data?.message || err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Checkout</h1>

      <div className="checkout-layout">
        {/* Shipping Form */}
        <div className="checkout-form">
          <h2>Shipping Address</h2>
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handlePlaceOrder}>
            <div className="form-group">
              <label>Street Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main Street"
                required
              />
            </div>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Madurai"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Postal Code</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="625001"
                  required
                />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="India"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="cart-summary">
          <h2>Your Order</h2>
          {cartItems && cartItems.map((item) => (
            <div key={item._id} className="summary-row">
              <span>{item.name} × {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <hr style={{ margin: '12px 0', borderColor: '#eee' }} />
          <div className="summary-row total">
            <span>Total</span>
            <span>${(cartTotal || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
