import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { productAPI } from '../../utils/api';
import './ProductDetail.css';

const LIVE_FISH = [
  { _id:'lf1', name:'Goldfish',   category:'Livestock', price:150,   unit:'fish', badge:'Popular',     inStock:true, imageUrl:'https://images.unsplash.com/photo-1583507171395-ab68f7afefc7?w=800&q=85', description:'Classic orange Goldfish. Hardy, peaceful, ideal for beginners. They thrive in well-maintained tanks and can live for 10-15 years with proper care. Available in multiple varieties including common, fancy, and celestial eye.', care:'Easy', size:'10-30 cm', temp:'18-24°C' },
  { _id:'lf2', name:'Guppy',      category:'Livestock', price:80,    unit:'fish', badge:'Best Seller', inStock:true, imageUrl:'https://images.unsplash.com/photo-1522069213448-443a614da9b6?w=800&q=85', description:'Colorful and lively Guppy fish. Perfect for community tanks. Extremely hardy and easy to breed. Available in multiple color variations including red, blue, multicolor, and more. Great for beginners.', care:'Easy', size:'3-6 cm', temp:'22-28°C' },
  { _id:'lf3', name:'Betta Fish', category:'Livestock', price:350,   unit:'fish', badge:'Premium',     inStock:true, imageUrl:'https://images.unsplash.com/photo-1596133970999-7dc36e82278f?w=800&q=85', description:'Stunning Siamese Fighting Fish with vivid flowing fins. Best kept alone or with peaceful tank mates. Available in Halfmoon, Crown Tail, and Double Tail varieties. Males are more vibrant in color.', care:'Moderate', size:'6-8 cm', temp:'24-30°C' },
  { _id:'lf4', name:'Arowana',    category:'Livestock', price:15000, unit:'fish', badge:'Rare',        inStock:true, imageUrl:'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800&q=85', description:'Majestic Silver Arowana — a symbol of luck and prosperity in Asian cultures. A large, predatory fish that can grow up to 90cm. Requires a minimum 300-litre tank. Feed with live or frozen food.', care:'Expert', size:'60-120 cm', temp:'24-30°C' },
];

const FALLBACK = [
  { _id:'p1', name:'Custom Glass Tank 3ft', category:'Fish Tanks', price:8500, unit:'unit', badge:'New', inStock:true, imageUrl:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85', description:'Premium custom glass aquarium, 3 feet long. Perfect for a community fish setup. Comes with glass lid, base cabinet option available. Thickness: 8mm glass. We offer custom sizes from 1ft to 8ft.' },
  { _id:'p2', name:'Canister Filter Pro 1200L', category:'Filters', price:3200, unit:'unit', badge:'Popular', inStock:true, imageUrl:'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&q=85', description:'High-performance external canister filter. 1200 litres per hour flow rate. Comes with complete filter media, spray bar and intake tube. Ultra-quiet motor. Suitable for tanks up to 400 litres.' },
  { _id:'p3', name:'LED Spectrum Light 60cm', category:'Lights', price:1800, unit:'unit', badge:'', inStock:true, imageUrl:'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=85', description:'Full spectrum LED aquarium light 60cm. Promotes plant growth and brings out natural fish colors. Built-in timer function, adjustable brightness. Energy efficient. Suitable for planted and reef tanks.' },
  { _id:'p4', name:'Live Plant Bundle Pack', category:'Plants', price:650, unit:'pack', badge:'Best Seller', inStock:true, imageUrl:'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=85', description:'Assorted live aquatic plants pack including Java Fern, Anubias, and Amazon Sword. Provides natural filtration, oxygenation, and hiding spots for fish. Great for beginners.' },
  { _id:'p5', name:'Premium Fish Food 500g', category:'Fish Food', price:350, unit:'pack', badge:'', inStock:true, imageUrl:'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=800&q=85', description:'Complete nutrition pellets for tropical fish. High protein and vitamin content. Enhances color and boosts immunity. Suitable for all tropical freshwater fish. Does not cloud water.' },
  { _id:'p6', name:'Driftwood Decor Set', category:'Decorations', price:1200, unit:'set', badge:'', inStock:true, imageUrl:'https://images.unsplash.com/photo-1621181483028-5f8b4a3d58c8?w=800&q=85', description:'Natural aquarium driftwood set. Pre-soaked and ready to use. Each piece is unique in shape and size. Creates natural hiding spots. Enriches aquascape aesthetics. Set of 3 pieces.' },
];

const ALL = [...LIVE_FISH, ...FALLBACK];
const CARE_COLOR = { Easy: '#3fb950', Moderate: '#e3b341', Expert: '#f85149' };
const SUPPORT_PROMISES = [
  { icon: 'fa-shield-heart', title: 'Healthy stock promise', text: 'Care-first sourcing and practical guidance before you take the product home.' },
  { icon: 'fa-truck-fast', title: 'Pickup or local delivery', text: 'Quick handoff for essentials and coordinated support for livestock orders.' },
  { icon: 'fa-headset', title: 'Setup assistance', text: 'Ask for compatibility, maintenance, filtration, lighting, or tank-size advice.' },
];

const CATEGORY_DETAILS = {
  'Fish Tanks': {
    label: 'Tank setup note',
    bullets: ['Best paired with proper filtration and lighting planning.', 'Ask for cabinet, glass thickness, and custom sizing options.', 'Ideal for freshwater displays, planted layouts, and custom builds.'],
  },
  Filters: {
    label: 'Filtration note',
    bullets: ['Choose flow rate based on tank volume and stocking level.', 'Good biological media helps maintain stable water quality.', 'Useful for both clear display tanks and heavily stocked systems.'],
  },
  Lights: {
    label: 'Lighting note',
    bullets: ['Useful for plant growth, colour rendering, and display impact.', 'Spectrum and intensity should match your tank depth and livestock.', 'Ask for timer recommendations if you want a low-maintenance cycle.'],
  },
  Plants: {
    label: 'Plant care note',
    bullets: ['Live plants help with oxygenation and a more natural look.', 'Beginner-friendly packs are easier to maintain in community tanks.', 'Substrate, trimming, and lighting choices affect long-term growth.'],
  },
  'Fish Food': {
    label: 'Feeding note',
    bullets: ['Balanced feeding helps colour, activity, and digestion.', 'Choose pellet size and protein level based on fish type.', 'Avoid overfeeding to keep water quality stable.'],
  },
  Decorations: {
    label: 'Aquascape note',
    bullets: ['Decor pieces help build depth, shelter, and a stronger visual layout.', 'Check rough edges before adding around delicate livestock.', 'Hardscape selection affects swimming room and maintenance access.'],
  },
  Livestock: {
    label: 'Livestock note',
    bullets: ['Compatibility, tank size, and water parameters matter before purchase.', 'Acclimation and quarantine reduce stress during introduction.', 'Ask for feeding, care, and tankmate guidance before finalising.'],
  },
};

function fallbackProduct(id) {
  return ALL.find(product => product._id === id) || null;
}

function getGallery(product) {
  const fallbackImage = product.imageUrl || `https://via.placeholder.com/900x900/0d1f3c/ffffff?text=${encodeURIComponent(product.name)}`;
  const images = [fallbackImage, ...(product.images || []), ...(product.galleryImages || [])].filter(Boolean);
  return images.filter((image, index) => images.indexOf(image) === index);
}

export default function ProductDetail() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { addToCart, openCart } = useCart();
  const [product,    setProduct]  = useState(null);
  const [loading,    setLoading]  = useState(true);
  const [qty,        setQty]      = useState(1);
  const [activeImg,  setActiveImg] = useState(0);
  const [related,    setRelated]  = useState([]);

  useEffect(() => {
    setLoading(true);
    productAPI.getById(id)
      .then(res => {
        const nextProduct = res.data?.data;
        if (!nextProduct) {
          throw new Error('not found');
        }

        setProduct(nextProduct);
        return productAPI.getAll({ category: nextProduct.category, limit: 4 })
          .then(relatedResponse => {
            const relatedItems = (relatedResponse.data?.data || []).filter(item => item._id !== id).slice(0, 3);
            setRelated(relatedItems);
          });
      })
      .catch(() => {
        const local = fallbackProduct(id);
        if (local) {
          setProduct(local);
          setRelated(ALL.filter(item => item.category === local.category && item._id !== id).slice(0, 3));
        }
        else navigate('/shop');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <div className="pd-loading"><i className="fas fa-spinner fa-spin"></i> Loading...</div>;
  if (!product) return null;

  const detailBlock = CATEGORY_DETAILS[product.category] || CATEGORY_DETAILS.Livestock;
  const images = getGallery(product);
  const availabilityText = product.inStock
    ? (product.stock > 0 ? `${product.stock} ready to dispatch or reserve` : 'Ready to dispatch or reserve')
    : 'Currently out of stock';
  const highlightRows = [
    { label: 'Availability', value: availabilityText },
    { label: 'Best for', value: product.category === 'Livestock' ? 'Care-aware hobbyists and guided tank additions' : 'Freshwater display, planted, or maintenance-focused setups' },
    { label: 'Fulfilment', value: product.category === 'Livestock' ? 'Pickup preferred, local delivery support available' : 'Quick packing and local delivery coordination' },
  ];

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    openCart();
  };

  return (
    <div className="pd-wrap">
      <div className="pd-container">
        <div className="pd-breadcrumb">
          <span onClick={() => navigate('/')}>Home</span>
          <i className="fas fa-chevron-right"></i>
          <span onClick={() => navigate('/shop')}>Shop</span>
          <i className="fas fa-chevron-right"></i>
          <span onClick={() => navigate('/shop?category=' + product.category)}>{product.category}</span>
          <i className="fas fa-chevron-right"></i>
          <span className="active">{product.name}</span>
        </div>

        <div className="pd-headline">
          <div>
            <span className="pd-kicker">Fish Paradise product detail</span>
            <h1>{product.name}</h1>
            <p>Made for buyers who want a cleaner setup, better livestock care, and fewer guesswork purchases.</p>
          </div>
          <div className="pd-headline-card">
            <strong>Need advice before you buy?</strong>
            <span>Send the product name on WhatsApp and ask for tank compatibility, maintenance, or fish care guidance.</span>
          </div>
        </div>

        <div className="pd-main">
          <div className="pd-images">
            <div className="pd-main-img">
              <img src={images[activeImg] || images[0]} alt={product.name} />
              {product.badge && <span className="pd-badge">{product.badge}</span>}
              {product.category === 'Livestock' && (
                <div className="pd-live-tag"><i className="fas fa-circle"></i> Live Fish</div>
              )}
            </div>
            <div className="pd-thumbs">
              {images.map((img, i) => (
                <div key={i} className={"pd-thumb" + (i === activeImg ? ' active' : '')} onClick={() => setActiveImg(i)}>
                  <img src={img} alt={"View " + (i+1)} />
                </div>
              ))}
            </div>
          </div>

          <div className="pd-info">
            <p className="pd-cat"><i className="fas fa-tag"></i> {product.category}</p>
            <h2 className="pd-name">{product.name}</h2>

            <div className="pd-rating">
              {[1,2,3,4,5].map(i => <i key={i} className="fas fa-star"></i>)}
              <span>4.8</span>
              <span className="pd-reviews">(24 reviews)</span>
            </div>

            <div className="pd-price-box">
              <div className="pd-price">Rs.{product.price.toLocaleString('en-IN')}</div>
              <div className="pd-unit">per {product.unit}</div>
            </div>

            <div className="pd-highlight-grid">
              {highlightRows.map(item => (
                <div className="pd-highlight-card" key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>

            {product.care && (
              <div className="pd-fish-specs">
                <div className="pd-spec"><span>Care Level</span><span style={{ color: CARE_COLOR[product.care] }}>{product.care}</span></div>
                {product.size && <div className="pd-spec"><span>Max Size</span><span>{product.size}</span></div>}
                {product.temp && <div className="pd-spec"><span>Temperature</span><span>{product.temp}</span></div>}
              </div>
            )}

            <div className="pd-divider"></div>

            <div className="pd-desc">
              <h3>Overview</h3>
              <p>{product.description}</p>
            </div>

            <div className="pd-note-box">
              <span>{detailBlock.label}</span>
              <ul>
                {detailBlock.bullets.map(point => <li key={point}>{point}</li>)}
              </ul>
            </div>

            <div className="pd-divider"></div>

            <div className={"pd-stock " + (product.inStock ? 'in' : 'out')}>
              <i className={"fas " + (product.inStock ? 'fa-check-circle' : 'fa-times-circle')}></i>
              {product.inStock ? 'In Stock — Ready for Pickup or Delivery' : 'Currently Out of Stock'}
            </div>

            {product.inStock && (
              <div className="pd-qty-row">
                <div className="pd-qty">
                  <button onClick={() => setQty(q => Math.max(1, q-1))}>-</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(q => q+1)}>+</button>
                </div>
                <span className="pd-total">Total: Rs.{(product.price * qty).toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="pd-actions">
              <button className="pd-add-btn" onClick={handleAdd} disabled={!product.inStock}>
                <i className="fas fa-shopping-cart"></i>
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button
                className="pd-buy-now-btn"
                onClick={() => { handleAdd(); }}
                disabled={!product.inStock}
              >
                <i className="fas fa-bolt"></i> Buy Now
              </button>
              <a
                href={"https://wa.me/919886198869?text=Hi%20Fish%20Paradise%2C%20I%20am%20interested%20in%20" + encodeURIComponent(product.name)}
                target="_blank"
                rel="noreferrer"
                className="pd-wa-btn"
              >
                <i className="fab fa-whatsapp"></i> WhatsApp Enquiry
              </a>
            </div>

            <div className="pd-trust">
              {SUPPORT_PROMISES.map(item => (
                <div className="pd-trust-item" key={item.title}>
                  <i className={"fas " + item.icon}></i>
                  <strong>{item.title}</strong>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pd-support-strip">
          <div className="pd-support-card">
            <span>Purchase confidence</span>
            <strong>Ask before you buy</strong>
            <p>We can help match this item to tank size, livestock mix, filtration load, or aquascape goal.</p>
          </div>
          <div className="pd-support-card">
            <span>Ideal use</span>
            <strong>{product.category === 'Livestock' ? 'Introduce carefully' : 'Build around this product'}</strong>
            <p>{product.category === 'Livestock' ? 'Get acclimation and tankmate guidance before adding new fish.' : 'Pair this with the right supporting products for a cleaner and more stable setup.'}</p>
          </div>
          <div className="pd-support-card">
            <span>Need a full setup?</span>
            <strong>Custom recommendation available</strong>
            <p>Share your budget and tank size to get a more complete shortlist from Fish Paradise.</p>
          </div>
        </div>

        {related.length > 0 && (
          <div className="pd-related">
            <h2>You May Also Like</h2>
            <div className="pd-related-grid">
              {related.map(p => (
                <div key={p._id} className="pd-rel-card" onClick={() => navigate('/shop/' + p._id)}>
                  <div className="pd-rel-img"><img src={p.imageUrl} alt={p.name} loading="lazy" /></div>
                  <div className="pd-rel-body">
                    <p>{p.category}</p>
                    <div>
                      <h4>{p.name}</h4>
                      <span>Rs.{p.price.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}