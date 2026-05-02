import React from 'react';
import './TopBar.css';

const SOCIAL = [
  { href: 'https://www.facebook.com/Fishparadise.in', icon: 'fab fa-facebook-f', label: 'Facebook' },
  { href: 'https://www.instagram.com/fishparadise.in1', icon: 'fab fa-instagram', label: 'Instagram' },
  { href: 'https://www.youtube.com/@theaquariumexperts', icon: 'fab fa-youtube', label: 'YouTube' },
];

export default function TopBar() {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <a href="tel:+919886198869">
          <i className="fas fa-phone-alt"></i> +91-9886198869
        </a>
        <span className="sep">|</span>
        <a href="mailto:support@fishparadise.in">
          <i className="fas fa-envelope"></i> support@fishparadise.in
        </a>
      </div>
      <div className="topbar-right">
        {SOCIAL.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            className="soc-icon"
            aria-label={s.label}
          >
            <i className={s.icon}></i>
          </a>
        ))}
      </div>
    </div>
  );
}
