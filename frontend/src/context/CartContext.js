import React, { createContext, useState, useEffect, useContext } from 'react';

export const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('cart');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i._id === product._id);
      if (existing) {
        return prev.map((i) => (i._id === product._id ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (id) => setCartItems((prev) => prev.filter((i) => i._id !== id));

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return removeFromCart(id);
    setCartItems((prev) => prev.map((i) => (i._id === id ? { ...i, quantity } : i)));
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 0), 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};
