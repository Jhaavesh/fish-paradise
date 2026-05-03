import React, { useState, useEffect } from 'react';
import { productAPI } from '../../utils/api';
import { useCart } from '../../context/CartContext';
import './Shop.css';
import { useNavigate } from 'react-router-dom'; // ✅ added

const CATS = ['All', 'Fish Tanks', 'Live Fish', 'Filters', 'Lights', 'Plants', 'Fish Food', 'Decorations'];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [cat, setCat] = useState('All');
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  const { addToCart, openCart } = useCart();
  const navigate = useNavigate(); // ✅ added

  useEffect(() => {
    setLoading(true);

    const params = cat !== 'All' ? { category: cat } : {};

    productAPI.getAll(params)
      .then(res => setProducts(res.data.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));

  }, [cat]);

  const toggleWishlist = (id) => {
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <section className="shop-section">
      <div className="shop-container">

        <div className="shop-header">
          <span className="section-tag">Our Products</span>
          <h2 className="section-title" style={{ color: '#fff' }}>
            Shop Premium Aquarium Supplies
          </h2>
        </div>

        <div className="shop-cats">
          {CATS.map(c => (
            <button
              key={c}
              className={"cat-btn" + (cat === c ? ' active' : '')}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="shop-loading">
            {[1,2,3,4].map(i => <div key={i} className="product-skeleton" />)}
          </div>
        ) : (
          <div className="products-grid">
            {products.map(p => (

              <div
                className="product-card"
                key={p._id}
                onClick={() => navigate('/shop/' + p._id)} // ✅ MAIN FIX (industry standard)
                style={{ cursor: 'pointer' }}
              >

                <div className="product-img">
                  <img
                    src={p.imageUrl || CATEGORY_IMAGES[p.category]}
                    alt={p.name}
                  />
                </div>

                <div className="product-body">
                  <p className="product-cat">{p.category}</p>
                  <h3 className="product-name">{p.name}</h3>

                  <div className="product-price-row">
                    <span className="product-price">₹{p.price}</span>

                    <button
                      className={"wishlist-btn" + (wishlist.includes(p._id) ? ' active' : '')}
                      onClick={(e) => {
                        e.stopPropagation(); // ✅ important
                        toggleWishlist(p._id);
                      }}
                    >
                      <i className={wishlist.includes(p._id) ? 'fas fa-heart' : 'far fa-heart'}></i>
                    </button>
                  </div>
                </div>

                <div className="product-footer">
                  <button
                    className="btn-cart"
                    onClick={(e) => {
                      e.stopPropagation(); // ✅ important
                      addToCart(p);
                      openCart();
                    }}
                    disabled={!p.inStock}
                  >
                    {p.inStock ? 'Add to Cart' : 'Unavailable'}
                  </button>
                </div>

              </div>

            ))}
          </div>
        )}

      </div>
    </section>
  );
}