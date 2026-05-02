import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './ShopPage.css';

const CATS = ['All', 'Fish Tanks', 'Filters', 'Lights', 'Plants', 'Fish Food', 'Decorations', 'Livestock'];
const CAT_ICONS = { All: 'fa-th-large', 'Fish Tanks': 'fa-water', Filters: 'fa-filter', Lights: 'fa-lightbulb', Plants: 'fa-leaf', 'Fish Food': 'fa-drumstick-bite', Decorations: 'fa-gem', Livestock: 'fa-fish' };
const SORT_OPTS = [
  { label: 'Newest First', val: 'newest' },
  { label: 'Price: Low-High', val: 'price_asc' },
  { label: 'Price: High-Low', val: 'price_desc' },
  { label: 'Name A-Z', val: 'name_asc' },
];

const LIVE_FISH = [
  { _id: 'lf1', name: 'Goldfish', category: 'Livestock', price: 150, unit: 'fish', badge: 'Popular', inStock: true, imageUrl: 'https://images.unsplash.com/photo-1583507171395-ab68f7afefc7?w=600&q=80', description: 'Classic orange Goldfish. Hardy, peaceful, ideal for beginners. They thrive in well-maintained tanks and can live for 10-15 years with proper care. Available in multiple varieties.' },
  { _id: 'lf2', name: 'Guppy', category: 'Livestock', price: 80, unit: 'fish', badge: 'Best Seller', inStock: true, imageUrl: 'https://images.unsplash.com/photo-1522069213448-443a614da9b6?w=600&q=80', description: 'Colorful and lively Guppy fish. Perfect for community tanks. Extremely hardy and easy to breed. Available in multiple color variations including red, blue, and multicolor.' },
  { _id: 'lf3', name: 'Betta Fish', category: 'Livestock', price: 350, unit: 'fish', badge: 'Premium', inStock: true, imageUrl: 'https://images.unsplash.com/photo-1596133970999-7dc36e82278f?w=600&q=80', description: 'Stunning Siamese Fighting Fish with vivid flowing fins. Best kept alone or with peaceful tank mates. Available in various fin types: Halfmoon, Crown Tail, Double Tail.' },
  { _id: 'lf4', name: 'Arowana', category: 'Livestock', price: 15000, unit: 'fish', badge: 'Rare', inStock: true, imageUrl: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=600&q=80', description: 'Majestic Silver Arowana, a symbol of luck and prosperity. Grows up to 90cm. Requires a very large tank (minimum 300 litres). Feed with live or frozen food.' },
];

const FALLBACK = [
  { _id: 'p1', name: 'Custom Glass Tank 3ft', category: 'Fish Tanks', price: 8500, unit: 'unit', badge: 'New', inStock: true, imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', description: 'Premium custom glass aquarium, 3 feet long. Perfect for a community fish setup. Comes with glass lid, base cabinet option available. Thickness: 8mm glass.' },
  { _id: 'p2', name: 'Canister Filter Pro 1200L', category: 'Filters', price: 3200, unit: 'unit', badge: 'Popular', inStock: true, imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600&q=80', description: 'High-performance external canister filter. 1200 litres per hour flow rate. Comes with all filter media, spray bar and intake tube. Suitable for tanks up to 400L.' },
  { _id: 'p3', name: 'LED Spectrum Light 60cm', category: 'Lights', price: 1800, unit: 'unit', badge: '', inStock: true, imageUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&q=80', description: 'Full spectrum LED aquarium light. 60cm length. Promotes plant growth and brings out the natural colors of fish. Timer compatible, adjustable brightness.' },
  { _id: 'p4', name: 'Live Plant Bundle Pack', category: 'Plants', price: 650, unit: 'pack', badge: 'Best Seller', inStock: true, imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80', description: 'Assorted live aquatic plants pack. Includes Java Fern, Anubias, and Amazon Sword. Great for beginners. Provides natural filtration and hiding spots for fish.' },
  { _id: 'p5', name: 'Premium Fish Food 500g', category: 'Fish Food', price: 350, unit: 'pack', badge: '', inStock: true, imageUrl: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=600&q=80', description: 'Complete nutrition pellets for tropical fish. High protein content. Enhances color and immunity. Suitable for all tropical freshwater fish. Does not cloud water.' },
  { _id: 'p6', name: 'Driftwood Decor Set', category: 'Decorations', price: 1200, unit: 'set', badge: '', inStock: true, imageUrl: 'https://images.unsplash.com/photo-1621181483028-5f8b4a3d58c8?w=600&q=80', description: 'Natural aquarium driftwood set. Pre-soaked and ready to use. Each piece is unique. Creates natural hiding spots and enriches the aquascape. Set of 3 pieces.' },
];

function normalizeCategory(category) {
  return category === 'Live Fish' ? 'Livestock' : category;
}

function buildMergedProducts(products, category) {
  const items = [];
  if (category === 'All' || category === 'Livestock') items.push(...LIVE_FISH);
  items.push(...products);
  const seen = new Set();
  return items.filter(product => {
    const key = product._id || `${normalizeCategory(product.category)}-${product.name}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).map(product => ({ ...product, category: normalizeCategory(product.category) }));
}

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();
  const initialCategory = normalizeCategory(searchParams.get('category') || 'All');

  const [products, setProducts] = useState([]);
  const [cat, setCat] = useState(CATS.includes(initialCategory) ? initialCategory : 'All');
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [sideOpen, setSideOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [showTop, setShowTop] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const gridRef = useRef(null);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (cat !== 'All') params.set('category', cat);
    if (search) params.set('search', search);
    fetch('/api/products?' + params.toString())
      .then(r => r.json())
      .then(d => setProducts(d.data || FALLBACK))
      .catch(() => setProducts(FALLBACK.filter(p => (cat === 'All' || p.category === cat) && (!search || p.name.toLowerCase().includes(search.toLowerCase())))))
      .finally(() => setLoading(false));
  }, [cat, search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    const q = searchParams.get('search') || '';
    const queryCategory = normalizeCategory(searchParams.get('category') || 'All');
    setSearch(q);
    if (CATS.includes(queryCategory)) setCat(queryCategory);
  }, [searchParams]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleWish = id => setWishlist(w => w.includes(id) ? w.filter(i => i !== id) : [...w, id]);

  const allProducts = buildMergedProducts(products, cat)
    .filter(product => cat === 'All' || normalizeCategory(product.category) === cat);

  const filtered = allProducts
    .filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    .filter(p => !inStockOnly || p.inStock)
    .sort((a, b) => {
      if (sort === 'price_asc') return a.price - b.price;
      if (sort === 'price_desc') return b.price - a.price;
      if (sort === 'name_asc') return a.name.localeCompare(b.name);
      return 0;
    });
  const handleAdd = (p) => {
    addToCart(p);
  };
  const inStockCount = filtered.filter(p => p.inStock).length;

  return (
    <div className="sp-wrap">
      {/* Toast */}
      {toast && (
        <div className="sp-toast">
          <i className="fas fa-check-circle"></i>
          <span><strong>{toast}</strong> added to cart!</span>
        </div>
      )}

      {/* Scroll to top */}
      {showTop && (
        <button className="sp-scroll-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <i className="fas fa-chevron-up"></i>
        </button>
      )}

      {/* ===== COMPACT HERO ===== */}
      <div className="sp-hero">
        <div className="sp-hero-bubbles" aria-hidden="true">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
        <div className="sp-hero-inner">
          <div className="sp-hero-left">
            <div className="sp-breadcrumb">
              <span onClick={() => navigate('/')}>Home</span>
              <i className="fas fa-chevron-right"></i>
              <span className="active">Shop</span>
            </div>
            <h1>Our Products</h1>
            <p>Explore premium aquarium essentials — live fish, tanks, filters, lights &amp; more.</p>
            <div className="sp-hero-tags">
              <span><i className="fas fa-truck"></i> Free Delivery Above ₹999</span>
              <span><i className="fas fa-shield-alt"></i> Quality Guaranteed</span>
              <span><i className="fas fa-headset"></i> Expert Support</span>
            </div>
          </div>
          <div className="sp-hero-stats">
            <div className="sp-stat"><strong>{filtered.length}</strong><span>Products</span></div>
            <div className="sp-stat-divider"></div>
            <div className="sp-stat"><strong>{inStockCount}</strong><span>In Stock</span></div>
            <div className="sp-stat-divider"></div>
            <div className="sp-stat"><strong>{new Set(filtered.map(p => p.category)).size}</strong><span>Categories</span></div>
          </div>
        </div>
      </div>

      {/* ===== CATEGORY TABS (horizontal, below hero) ===== */}
      <div className="sp-cat-bar">
        <div className="sp-cat-bar-inner">
          {CATS.map(c => (
            <button key={c} className={"sp-cat-tab" + (cat === c ? ' active' : '')} onClick={() => setCat(c)}>
              <i className={"fas " + CAT_ICONS[c]}></i>
              <span>{c}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ===== MAIN LAYOUT ===== */}
      <div className="sp-body">
        <div className="sp-body-inner">

          {/* Mobile filter toggle */}
          <button className="sp-filter-toggle" onClick={() => setSideOpen(!sideOpen)}>
            <i className="fas fa-sliders-h"></i> Filters {sideOpen ? '▲' : '▼'}
          </button>

          {/* Sidebar */}
          <aside className={"sp-sidebar" + (sideOpen ? ' open' : '')}>
            <div className="sp-side-section">
              <h4>Price Range</h4>
              <div className="sp-price-display">
                <span>₹{priceRange[0].toLocaleString('en-IN')}</span>
                <span>—</span>
                <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
              </div>
              <input type="range" min={0} max={20000} step={100} value={priceRange[1]}
                onChange={e => setPriceRange([0, Number(e.target.value)])} className="sp-range" />
            </div>

            <div className="sp-side-section">
              <h4>Availability</h4>
              <label className="sp-switch-label">
                <div className={"sp-switch" + (inStockOnly ? ' on' : '')} onClick={() => setInStockOnly(!inStockOnly)}>
                  <div className="sp-switch-thumb"></div>
                </div>
                <span>In Stock Only</span>
              </label>
            </div>

            <div className="sp-side-section">
              <h4>Sort By</h4>
              <div className="sp-sort-btns">
                {SORT_OPTS.map(o => (
                  <button key={o.val} className={"sp-sort-chip" + (sort === o.val ? ' active' : '')} onClick={() => setSort(o.val)}>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            <button className="sp-reset-btn" onClick={() => { setCat('All'); setSort('newest'); setPriceRange([0, 20000]); setInStockOnly(false); setSearch(''); }}>
              <i className="fas fa-undo"></i> Reset All
            </button>
          </aside>

          {/* Main content */}
          <div className="sp-main">
            {/* Search bar */}
            <div className="sp-toolbar">
              <div className="sp-search">
                <i className="fas fa-search"></i>
                <input type="text" placeholder="Search products..." value={search}
                  onChange={e => setSearch(e.target.value)} />
                {search && <button onClick={() => setSearch('')}><i className="fas fa-times"></i></button>}
              </div>
              <div className="sp-toolbar-right">
                <div className="sp-view-toggle">
                  <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}><i className="fas fa-th"></i></button>
                  <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}><i className="fas fa-list"></i></button>
                </div>
                <span className="sp-count">{filtered.length} results</span>
              </div>
            </div>

            {/* Live fish banner */}
            {(cat === 'Livestock' || cat === 'All') && (
              <div className="sp-live-strip">
                <i className="fas fa-fish"></i>
                <span>Live Fish Available — Tank-Raised &amp; Ready for Pickup</span>
                <span className="sp-live-badge"><i className="fas fa-shield-alt"></i> Live Arrival Guaranteed</span>
              </div>
            )}

            {/* Grid */}
            {loading ? (
              <div className="sp-grid">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="sp-skel" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="sp-empty">
                <i className="fas fa-search"></i>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search term</p>
                <button onClick={() => { setCat('All'); setPriceRange([0, 20000]); setInStockOnly(false); setSearch(''); }}>
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className={"sp-grid" + (viewMode === 'list' ? ' sp-list-view' : '')} ref={gridRef}>
                {filtered.map((p, i) => (
                  <div className="sp-card" key={p._id} style={{ animationDelay: `${i * 0.04}s` }}>
                    {/* Image */}
                    <div className="sp-card-img" onClick={() => navigate('/shop/' + p._id)}>
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        loading="lazy"
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                      <div className="sp-card-img-placeholder">
                        <i className={"fas " + (CAT_ICONS[p.category] || 'fa-box')}></i>
                      </div>

                      {p.badge && (
                        <span className={"sp-badge " + p.badge.toLowerCase().replace(/\s/g, '-')}>
                          {p.badge}
                        </span>
                      )}

                      {!p.inStock && <div className="sp-oos">Out of Stock</div>}

                      {p.category === 'Livestock' && p.inStock && (
                        <span className="sp-live-dot"><i className="fas fa-circle"></i> Live</span>
                      )}

                      <button
                        className={"sp-wish" + (wishlist.includes(p._id) ? ' active' : '')}
                        onClick={e => { e.stopPropagation(); toggleWish(p._id); }}
                      >
                        <i className={wishlist.includes(p._id) ? 'fas fa-heart' : 'far fa-heart'}></i>
                      </button>

                      {/* Quick action overlay */}
                      <div className="sp-card-overlay">
                        <button onClick={(e) => { e.stopPropagation(); navigate('/shop/' + p._id); }}>
                          <i className="fas fa-eye"></i> Quick View
                        </button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="sp-card-info" onClick={() => navigate('/shop/' + p._id)}>
                      <span className="sp-card-cat">
                        <i className={"fas " + (CAT_ICONS[p.category] || 'fa-gem')}></i> {p.category}
                      </span>
                      <h3>{p.name}</h3>
                      <p className="sp-card-desc">{p.description?.slice(0, 72)}{p.description?.length > 72 ? '…' : ''}</p>
                      <div className="sp-card-price-row">
                        <span className="sp-card-price">₹{p.price.toLocaleString('en-IN')}</span>
                        <small>/{p.unit}</small>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="sp-card-actions">
                      <button className="sp-btn-cart" onClick={() => handleAdd(p)} disabled={!p.inStock}>
                        <i className="fas fa-cart-plus"></i>
                        {p.inStock ? 'Add to Cart' : 'Unavailable'}
                      </button>
                      <button className="sp-btn-view" onClick={() => navigate('/shop/' + p._id)}>
                        <i className="fas fa-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
