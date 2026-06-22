import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const AdminDashboardPage = () => {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: '', stock: '', image: ''
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [prodRes, ordRes] = await Promise.all([
        api.get('/products'),
        api.get('/orders'),
      ]);
      setProducts(prodRes.data.products || prodRes.data);
      setOrders(ordRes.data);
    } catch (err) {
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  const openAddForm = () => {
    setEditProduct(null);
    setFormData({ name: '', description: '', price: '', category: '', stock: '', image: '' });
    setFormError('');
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image: product.image || '',
    });
    setFormError('');
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };
      if (editProduct) {
        await api.put(`/products/${editProduct._id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      setShowForm(false);
      fetchAll();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save product.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert('Failed to delete product.');
    }
  };

  const handleStatusChange = async (orderId, status) => {
    setStatusUpdating(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status } : o))
      );
    } catch {
      alert('Failed to update status.');
    } finally {
      setStatusUpdating('');
    }
  };

  const statusColor = (status) => {
    const map = { pending: '#f59e0b', processing: '#3b82f6', shipped: '#8b5cf6', delivered: '#10b981', cancelled: '#ef4444' };
    return map[status] || '#6b7280';
  };

  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    revenue: orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.totalPrice, 0),
    pending: orders.filter(o => o.status === 'pending').length,
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error-msg">{error}</div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* Stats */}
      <div className="admin-stats">
        <div className="stat-card"><div className="stat-num">{stats.totalProducts}</div><div className="stat-label">Products</div></div>
        <div className="stat-card"><div className="stat-num">{stats.totalOrders}</div><div className="stat-label">Total Orders</div></div>
        <div className="stat-card"><div className="stat-num">₹{stats.revenue.toLocaleString()}</div><div className="stat-label">Revenue</div></div>
        <div className="stat-card"><div className="stat-num">{stats.pending}</div><div className="stat-label">Pending Orders</div></div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button className={`tab-btn ${tab === 'products' ? 'active' : ''}`} onClick={() => setTab('products')}>Products</button>
        <button className={`tab-btn ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>Orders</button>
      </div>

      {/* Products Tab */}
      {tab === 'products' && (
        <div className="admin-section">
          <div className="section-header">
            <h2>Products</h2>
            <button className="btn" onClick={openAddForm}>+ Add Product</button>
          </div>

          {showForm && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
                {formError && <p className="error-msg">{formError}</p>}
                <form onSubmit={handleFormSubmit} className="product-form">
                  <input placeholder="Product Name *" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                  <textarea placeholder="Description *" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                  <div className="form-row">
                    <input type="number" placeholder="Price (₹) *" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required min="0" />
                    <input type="number" placeholder="Stock *" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} required min="0" />
                  </div>
                  <input placeholder="Category *" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required />
                  <input placeholder="Image URL (optional)" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                  <div className="form-actions">
                    <button type="submit" className="btn" disabled={formLoading}>{formLoading ? 'Saving...' : 'Save Product'}</button>
                    <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id}>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>₹{p.price.toLocaleString()}</td>
                    <td><span className={p.stock < 5 ? 'low-stock' : ''}>{p.stock}</span></td>
                    <td>
                      <button className="btn btn-sm" onClick={() => openEditForm(p)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeleteProduct(p._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {tab === 'orders' && (
        <div className="admin-section">
          <div className="section-header"><h2>All Orders</h2></div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id}>
                    <td>#{o._id.slice(-8).toUpperCase()}</td>
                    <td>{o.user?.name || 'N/A'}</td>
                    <td>{o.items.map(i => `${i.name} x${i.quantity}`).join(', ')}</td>
                    <td>₹{o.totalPrice.toLocaleString()}</td>
                    <td>
                      <select
                        value={o.status}
                        onChange={e => handleStatusChange(o._id, e.target.value)}
                        disabled={statusUpdating === o._id}
                        style={{ color: statusColor(o.status), fontWeight: 600, border: `1.5px solid ${statusColor(o.status)}`, borderRadius: 6, padding: '3px 8px' }}
                      >
                        {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                    <td>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;