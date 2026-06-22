// src/pages/HomePage.js - Product catalog with search and category filter
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [addedId, setAddedId] = useState(null);

  const { addToCart } = useCart();

  // Fetch products whenever keyword or category changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {};
        if (keyword) params.keyword = keyword;
        if (category) params.category = category;

        const { data } = await api.get('/products', { params });
        setProducts(data);

        // Build unique category list from fetched products
        const cats = [...new Set(data.map((p) => p.category))];
        setCategories(cats);
      } catch (err) {
        setError('Failed to load products. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, category]);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="container">
      {/* Search & Filter Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="search-input"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="category-select"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {(keyword || category) && (
          <button onClick={() => { setKeyword(''); setCategory(''); }} className="btn-clear">
            Clear
          </button>
        )}
      </div>

      {/* Status messages */}
      {loading && <p className="status-msg">Loading products...</p>}
      {error && <div className="alert alert-error">{error}</div>}
      {!loading && !error && products.length === 0 && (
        <p className="status-msg">No products found.</p>
      )}

      {/* Product Grid */}
      <div className="product-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            {/* Product image or placeholder */}
            <Link to={`/products/${product._id}`}>
              <div className="product-image">
                {product.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  <div className="image-placeholder">No Image</div>
                )}
              </div>
            </Link>

            <div className="product-info">
              <Link to={`/products/${product._id}`} className="product-name">
                {product.name}
              </Link>
              <p className="product-category">{product.category}</p>
              <p className="product-price">${product.price.toFixed(2)}</p>
              <p className={`product-stock ${product.stock === 0 ? 'out-of-stock' : ''}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </p>

              <button
                className="btn-primary"
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
              >
                {addedId === product._id ? '✓ Added!' : 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
