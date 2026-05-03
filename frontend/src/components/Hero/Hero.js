import React from 'react';
import './Hero.css';

const VIDEO_URL = 'https://res.cloudinary.com/dpgfmhvnz/video/upload/Background.mp4_mrckys.mp4';

export default function Hero() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const renderVideo = () => {
    return (
      <video className="hero-video" autoPlay muted loop playsInline>
        <source src={VIDEO_URL} type="video/mp4" />
      </video>
    );
  };

  return (
    <section className="hero" id="home">
      {renderVideo()}

      <div className="hero-overlay" />

      <div className="hero-content">

        <span className="hero-eyebrow wave-water">Welcome to Fish Paradise</span>

        <h1 className="hero-title">
          Bring Your Dream<br />
          <span>Aquarium</span> to Life
        </h1>

        <p className="hero-desc">
          Transform your space with living art. Expert solutions for residential,
          commercial &amp; hi-tech aquariums.
        </p>

        <div className="hero-actions">

          <button className="btn-primary" onClick={() => scrollTo('contact')}>
            <i className="fas fa-paper-plane"></i>
            Get In Touch
          </button>

          <div className="trust-pill">
            <div className="trust-pill-icon">
              <i className="fas fa-award"></i>
            </div>

            <div className="trust-pill-content">
              <div className="trust-pill-title">Trusted Since 2007</div>

              <div className="trust-pill-stars">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
            </div>
          </div>

        </div>
      </div>

      <button className="hero-scroll-hint" onClick={() => scrollTo('stats')}>
        <i className="fas fa-chevron-down"></i>
      </button>
    </section>
  );
}