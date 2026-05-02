import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productAPI } from '../../utils/api';
import { useCart } from '../../context/CartContext';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, openCart } = useCart();

  useEffect(() => {
    if (id) {
      
      setLoading(true);
      productAPI.getById(id)
        .then(res => setProduct(res.data.data))
        .catch(err => console.error('Product load error:', err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <div className="loading">Loading product...</div>;
  if (!product) return <div className="not-found">Product not found</div>;

  return (
    <section className="product-detail-section">
      <div className="container">
        <Link to="/shop" className="back-link">
          <i className="fas fa-arrow-left"></i> Back to Shop
        </Link>

        <div className="product-detail-grid">
          <div className="product-image-large">
            <img src={product.imageUrl || `https://via.placeholder.com/600x400/00b4b4/ffffff?text=${encodeURIComponent(product.name)}`} alt={product.name} />
          </div>

          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>
            <p className="product-category">{product.category}</p>
            <div className="price-large">₹{product.price.toLocaleString()}</div>
            
            <div className="stock-status">
              {product.inStock ? (
                <span className="in-stock">In Stock</span>
              ) : (
                <span className="out-stock">Out of Stock</span>
              )}
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description || 'Detailed product description will be available here. Premium quality aquarium product for your fish paradise.'}</p>
            </div>

            <div className="product-actions">
              <button 
                className="btn-add-cart-large"
                onClick={() => {
                  addToCart(product);
                  openCart();
                }}
                disabled={!product.inStock}
              >
                <i className="fas fa-shopping-cart"></i>
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>

            <div className="product-meta">
              <p><strong>Category:</strong> {product.category}</p>
              <p><strong>Stock:</strong> {product.stock || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
