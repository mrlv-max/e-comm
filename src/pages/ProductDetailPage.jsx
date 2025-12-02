import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { addToCart } from '../redux/cartSlice';
import '../App.css'; 

import formatCurrencyINR from '../utils/formatCurrency';

const ProductDetailPage = ({ onAddToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  

  const resolveImage = (p) => {
    if (!p) return 'https://via.placeholder.com/500';

    if (Array.isArray(p.image) && p.image.length) return p.image[0];
    return p.image || p.imageUrl || p.images?.[0] || 'https://via.placeholder.com/500';

  };

  

  const resolveStock = (p) => {
    if (!p) return 10; 

    return p.countInStock ?? p.stock ?? p.quantity ?? p.available ?? 10;
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);

        if (!mounted) return;
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [id]);

  const addToCartHandler = () => {
    const payload = { ...product, id: product._id || product.id, quantity: qty };
    if (typeof onAddToCart === 'function') {
      onAddToCart(payload);
    } else {
      dispatch(addToCart(payload));
    }
    alert('Added to Cart!');
  };

  if (loading) return <div className="container" style={{padding: '50px', textAlign:'center'}}>Loading Product...</div>;
  if (!product) return <div className="container" style={{padding: '50px', textAlign:'center'}}>Product not found</div>;
  if (product.name.startsWith('REMOVED - ')) return <div className="container" style={{padding: '50px', textAlign:'center'}}>This product is no longer available</div>;

  const imageUrl = resolveImage(product);
  const stock = resolveStock(product);

  const averageRating = product.reviews && product.reviews.length > 0
    ? (product.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / product.reviews.length)
    : null;
  const roundedStars = averageRating ? Math.round(averageRating) : 0;

  return (
    <div className="container" style={{ marginTop: '40px' }}>
      <button className="back-btn" onClick={() => navigate(-1)}>← Back to Shop</button>

      <div className="product-detail-grid">
        
        <div className="detail-image-container">
          <img src={imageUrl} alt={product.name} />
        </div>

        <div className="detail-info">
          <span className="category-tag">{product.category || 'Handmade'}</span>

          <h1>{product.name}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0' }}>
            <div style={{ color: '#f59e0b', fontSize: '1.1rem' }}>
              {averageRating ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>{i < roundedStars ? '★' : '☆'}</span>
                ))
              ) : (
                Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-gray-300">☆</span>
                ))
              )}
            </div>
            <span style={{ color: '#888', fontSize: '0.9rem' }}>{product.reviews && product.reviews.length ? `(${product.reviews.length} review${product.reviews.length > 1 ? 's' : ''})` : ''}</span>
            {averageRating && (
              <span style={{ color: '#333', marginLeft: 8, fontSize: '0.95rem' }}>{averageRating.toFixed(1)}</span>
            )}
          </div>

          <h2 className="price-tag">{formatCurrencyINR(product.price ?? product.amount ?? 0)}</h2>

          <p className="description">{product.description}</p>

          <div className="vendor-info">
             <p style={{marginBottom: '20px', color: '#666'}}>
                Artisan Vendor: <strong>{product.vendor ? 'Verified Seller' : 'Artisanâ€™s Corner'}</strong>
             </p>
          </div>

          <div className="cart-actions">
            {stock > 0 ? (
                <>
                  <select value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                    {[...Array(Math.min(stock || 10, 10)).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>{x + 1}</option>
                    ))}
                  </select>
                  <button onClick={addToCartHandler} className="add-to-cart-btn">
                    Add to Cart
                  </button>
                </>
            ) : (
                <button disabled style={{ background: '#ccc', cursor: 'not-allowed' }} className="add-to-cart-btn">
                    Out of Stock
                </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
