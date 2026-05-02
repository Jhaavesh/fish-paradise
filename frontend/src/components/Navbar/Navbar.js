import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import logo from '../../assets/logo.png';
import './Navbar.css';

const LINKS = [
  { label: 'Home',    href: '/',       scroll: 'home'    },
  { label: 'Shop',    href: '/shop',   scroll: null      },
  { label: 'Gallery', href: '/#gallery', scroll: 'gallery' },
  { label: 'About',   href: '/#about',  scroll: 'about'   },
];

const SUGGESTIONS = [
  'Fish Tanks','Canister Filters','LED Lights','Live Plants',
  'Fish Food','Driftwood Decor','Reef Setup','Planted Tank Kit',
  'CO2 System','Heaters',
];

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [search,      setSearch]      = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const { itemCount, openCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    setSuggestions(
      search.length > 1
        ? SUGGESTIONS.filter(s => s.toLowerCase().includes(search.toLowerCase()))
        : []
    );
  }, [search]);

  const handleLink = (e, link) => {
    if (link.scroll && window.location.pathname === '/') {
      e.preventDefault();
      const el = document.getElementById(link.scroll);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate('/shop?search=' + encodeURIComponent(search.trim()));
      setSearch('');
      setSuggestions([]);
    }
  };

  return (
    <nav className={'navbar' + (scrolled ? ' scrolled' : '')}>
      <Link to="/" className="nav-logo">
        <img src={logo} alt="Fish Paradise" style={{ transform: 'scaleX(-1)' }} />
        <span>Fish <em>Paradise</em></span>
      </Link>

      <ul className={'nav-links' + (mobileOpen ? ' open' : '')}>
        {LINKS.map(l => (
          <li key={l.label}>
            <Link to={l.href} onClick={e => handleLink(e, l)}>{l.label}</Link>
          </li>
        ))}
        <li>
          <Link to="/#contact" onClick={e => handleLink(e, { scroll: 'contact' })} className="nav-cta">
            Contact Us
          </Link>
        </li>
      </ul>

      <div className="nav-right">
        <form className="nav-search-wrap" onSubmit={handleSearch}>
          <div className="nav-search">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onBlur={() => setTimeout(() => setSuggestions([]), 200)}
            />
            {search && (
              <button type="button" className="search-clear" onClick={() => { setSearch(''); setSuggestions([]); }}>
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
          {suggestions.length > 0 && (
            <div className="search-dropdown">
              {suggestions.map(s => (
                <div key={s} className="search-item" onMouseDown={() => { setSearch(s); setSuggestions([]); navigate('/shop?search=' + encodeURIComponent(s)); }}>
                  <i className="fas fa-fish"></i> {s}
                </div>
              ))}
            </div>
          )}
        </form>

        <button className="cart-btn" onClick={openCart} aria-label="Cart">
          <i className="fas fa-shopping-cart"></i>
          {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
        </button>

        <button className={'hamburger' + (mobileOpen ? ' active' : '')} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}