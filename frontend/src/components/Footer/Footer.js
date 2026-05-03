import React, { useState } from 'react';
import logo from '../../assets/logo.png';
import logo2 from '../../assets/logo2.png';
import logo3 from '../../assets/logo3.png';
import './Footer.css';

const WA_GROUP = process.env.REACT_APP_WA_GROUP || 'https://chat.whatsapp.com/YOUR_GROUP_LINK';

const QUICK  = [['Home','home'],['Shop','shop'],['Gallery','gallery'],['About Us','about'],['Contact','contact']];
const CATS   = ['Fish Tanks','Filters','Lights','Plants','Fish Food','Decorations'];
const SOCIAL = [
  { href: 'https://www.facebook.com/Fishparadise.in',         icon: 'fab fa-facebook-f', label: 'Facebook' },
  { href: 'https://www.instagram.com/fishparadise.in1',       icon: 'fab fa-instagram',  label: 'Instagram' },
  { href: 'https://www.youtube.com/@theaquariumexperts',      icon: 'fab fa-youtube',    label: 'YouTube' },
];

export default function Footer() {
  const [email, setEmail]   = useState('');
  const [subDone, setSubDone] = useState(false);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSub = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubDone(true);
    setEmail('');
    setTimeout(() => setSubDone(false), 4000);
  };

  return (
    <footer>
      {/* Top bar - uses original logo (white on blue bg, looks good on dark) */}
      <div className="footer-topbar">
        <div className="ftb-brand">
          <div className="ftb-logo-wrap">
            <img src={logo3} alt="Fish Paradise" />
          </div>
          <span>Fish <em>Paradise</em></span>
        </div>
        <div className="ftb-contacts">
          <a href="tel:+919886198869" className="ftb-item">
            <i className="fas fa-phone-alt"></i>
            <div><small>Call Us</small>+91-9886198869</div>
          </a>
          <a href="mailto:support@fishparadise.in" className="ftb-item">
            <i className="fas fa-envelope"></i>
            <div><small>Mail Us</small>support@fishparadise.in</div>
          </a>
          <div className="ftb-item">
            <i className="fas fa-map-marker-alt"></i>
            <div><small>Location</small>Chandra Layout, Bangalore - 560040</div>
          </div>
        </div>
      </div>

      {/* Main footer - uses logo2 (new blue-bg logo) */}
      <div className="footer-main">
        <div className="footer-brand-col">
          <div className="footer-logo">
            <div className="footer-logo-img-wrap footer-logo-img-wrap--blue">
              <img src={logo3} alt="Fish Paradise" />
            </div>
            <span>Fish <em>Paradise</em></span>
          </div>
          <p className="footer-desc">
            Your trusted partner for all aquarium needs. Quality products, expert guidance,
            and beautiful living art since 2007.
          </p>
          <div className="footer-soc">
            {SOCIAL.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}>
                <i className={s.icon}></i>
              </a>
            ))}
          </div>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            {QUICK.map(([label, id]) => (
              <li key={label}>
                <button onClick={() => scrollTo(id)}>
                  <i className="fas fa-angle-right"></i>{label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4>Categories</h4>
          <ul>
            {CATS.map((c) => (
              <li key={c}>
                <button onClick={() => scrollTo('shop')}>
                  <i className="fas fa-angle-right"></i>{c}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col footer-nl">
          <h4>Newsletter</h4>
          <p>Subscribe for offers, updates and aquarium tips.</p>
          <form className="nl-form" onSubmit={handleSub}>
            <input type="email" placeholder="Enter your email" value={email}
              onChange={(e) => setEmail(e.target.value)} />
            <button type="submit"><i className="fas fa-paper-plane"></i></button>
          </form>
          {subDone && <p className="nl-done"><i className="fas fa-check"></i> Subscribed!</p>}
          <a href={WA_GROUP} target="_blank" rel="noreferrer" className="wa-join">
            <i className="fab fa-whatsapp"></i> Join WhatsApp Group
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>2025 Fish Paradise. All rights reserved.</span>
        <div className="footer-bottom-links">
          <button onClick={() => scrollTo('contact')}>Contact</button>
        </div>
      </div>
    </footer>
  );
}
