import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import formatCurrencyINR from '../utils/formatCurrency';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  

  const [formData, setFormData] = useState({
    name: '', price: '', category: '', description: '', image: '', stock: ''
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const [sales, setSales] = useState([]);

  

  const getToken = () => {
    

    return localStorage.getItem('token');
  };

  

  const fetchMyProducts = async () => {
    const token = getToken();
    if (!token) {
      setError("You are not logged in. Please logout and login again.");
      setLoading(false);
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      

      const { data } = await axios.get('http://localhost:5000/api/vendor/my-products', config);

      setProducts(data || []);
      setLoading(false);
    } catch (err) {
      console.error('Fetch Error:', err);
      setError(err.response?.data?.message || 'Failed to load products.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  useEffect(() => {
    if (activeTab === 'sales') fetchVendorSales();
  }, [activeTab]);

  const fetchVendorSales = async () => {
    const token = getToken();
    if (!token) {
      setError('You are not logged in.');
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get('http://localhost:5000/api/vendor/my-sales', config);

      setSales(data || []);
    } catch (err) {
      console.error('Sales fetch error:', err);
      setError(err.response?.data?.message || 'Failed to load sales.');
    }
  };

  

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return alert("Not authorized. Please login.");

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
        
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        imageUrl: formData.image,
        stock: parseInt(formData.stock, 10) || 0,
      };
      if (editingProductId) {
        
        await axios.put(`http://localhost:5000/api/products/${editingProductId}`, payload, config);

        alert('Product updated successfully');
        setEditingProductId(null);
      } else {
        await axios.post('http://localhost:5000/api/products', payload, config);

        alert('Product Added Successfully!');
      }
      setFormData({ name: '', price: '', category: '', description: '', image: '', stock: '' });
      setActiveTab('products');
      fetchMyProducts(); 

    } catch (err) {
      console.error('Add Error:', err);
      alert(err.response?.data?.message || 'Failed to add product');
    }
  };

  

  const handleDelete = async (id) => {
    if(!window.confirm('Delete this item?')) return;
    const token = getToken();
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`http://localhost:5000/api/products/${id}`, config);


      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Delete error:', error);
      alert(error.response?.data?.message || 'Delete failed');
    }
  };

  const handleEdit = (product) => {
    setEditingProductId(product.id);
    setFormData({
      name: product.name || '',
      price: product.price || '',
      category: product.category || '',
      description: product.description || '',
      image: product.imageUrl || product.image || '',
      stock: product.stock != null ? String(product.stock) : '',
    });
    setActiveTab('add');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Seller Dashboard</h1>
        {error && <p style={{color: 'red', fontWeight: 'bold'}}>{error}</p>}
      </div>

      <div className="dashboard-controls">
        <button className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>My Products</button>
        <button className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`} onClick={() => setActiveTab('add')}>+ Add New Item</button>
        <button className={`tab-btn ${activeTab === 'sales' ? 'active' : ''}`} onClick={() => setActiveTab('sales')}>Sales</button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'products' && (
            <div className="products-grid">
                {products.length === 0 && !loading && <p>No products yet.</p>}
                {products.map((product) => (
                  <div key={product.id} className="product-card-mini">
                    <div style={{height: 180, overflow: 'hidden'}}>
                      <img
                        src={product.imageUrl || product.image || (Array.isArray(product.images) ? product.images[0] : undefined) || 'https://via.placeholder.com/400x300?text=No+Image'}
                        alt={product.name}
                        style={{width: '100%', height: '180px', objectFit: 'cover'}}
                      />
                    </div>
                    <div className="p-info">
                      <h4 title={product.name}>{product.name}</h4>
                      <p className="text-sm text-gray-500">Stock: {product.stock ?? product.countInStock ?? '—'}</p>
                      <p className="mt-2 font-bold">{formatCurrencyINR(product.price)}</p>
                    </div>
                    <div style={{display: 'flex', gap: 8, padding: 12}}>
                      <button className="edit-btn" onClick={() => handleEdit(product)}>✏️</button>
                      <button className="delete-btn" onClick={() => handleDelete(product.id)}>🗑️</button>
                    </div>
                  </div>
                ))}
            </div>
        )}

        {activeTab === 'add' && (
            <form className="add-product-form" onSubmit={handleAddSubmit}>
                <h2>List New Product</h2>
                <input type="text" placeholder="Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <input type="number" placeholder="Price" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                <input type="text" placeholder="Category" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                <input
                  type="text"
                  placeholder="Image URL (e.g. https://example.com/image.jpg)"
                  value={formData.image}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                />

                {formData.image && (
                  <div style={{ margin: '12px 0' }}>
                    <img src={formData.image} alt="Preview" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8 }} />
                  </div>
                )}
                <input type="number" placeholder="Stock (e.g. 10)" required value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                <textarea placeholder="Description" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                <button type="submit" className="submit-btn">{editingProductId ? 'Update Product' : 'Publish Product'}</button>
            </form>
        )}
        {activeTab === 'sales' && (
          <div className="sales-list">
            <h3>Recent Sales</h3>
            {sales.length === 0 && <p>No sales yet.</p>}
            {sales.map((s) => (
              <div key={s.id} className="sale-item" style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 12, borderBottom: '1px solid #eee' }}>
                <img
                  src={s.product?.imageUrl || s.product?.image || 'https://via.placeholder.com/200x150?text=No+Image'}
                  alt={s.product?.name || 'Product'}
                  style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 6 }}
                />

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{s.product?.name}</div>
                  <div style={{ fontSize: 13, color: '#666' }}>Qty: {s.quantity} • Order: {s.orderId}</div>
                  <div style={{ fontSize: 13, color: '#666' }}>Buyer: {s.order?.customer?.name || s.order?.customer?.email || '—'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700 }}>{formatCurrencyINR((s.product?.price || 0) * (s.quantity || 1))}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>{new Date(s.createdAt).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
