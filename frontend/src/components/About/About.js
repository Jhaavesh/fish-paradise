import React from 'react';
import './About.css';

const WHY = [
  { icon: 'fa-user-tie',  title: 'Expert Guidance',  desc: 'Professional advice from experienced aquarium specialists' },
  { icon: 'fa-medal',     title: 'Quality Products',  desc: 'Premium products sourced from trusted manufacturers' },
  { icon: 'fa-heart',     title: 'Customer First',    desc: 'Dedicated support and after-sales service' },
  { icon: 'fa-lightbulb', title: 'Innovation',        desc: 'Latest technology and modern custom aquarium solutions' },
];

const SERVICES = [
  'Custom aquarium design and installation',
  'Residential and commercial aquarium solutions',
  'Modern and hi-tech aquarium systems',
  'Premium fish food and care products',
  'Maintenance and support services',
];

const VIDEO_URL =
  'https://res.cloudinary.com/dpgfmhvnz/video/upload/aboutus_wuzmxq.mp4';

export default function About() {
  return (
    <section className="about-section" id="about">
      {/* ── VIDEO BACKGROUND ── */}
      <div className="about-video-bg">
        <video
          src={VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
          className="about-video"
        />
        <div className="about-video-overlay" />
      </div>

      {/* ── CONTENT ── */}
      <div className="about-inner container">
        {/* LEFT – images & quote card */}
        <div className="about-imgs">
          <div className="about-img-stack">
            <img
              className="about-main-img"
              src="https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=700&q=80"
              alt="Beautiful aquarium"
            />
            <img
              className="about-accent-img"
              src="https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=400&q=80"
              alt="Aquarium fish"
            />
          </div>
          <div className="about-quote-card">
            <span className="qmark">"</span>
            <p>There is nothing quite like a day at the aquarium. These are the moments we live for.</p>
            <cite>MAHESH – CEO / FOUNDER</cite>
          </div>
        </div>

        {/* RIGHT – text content */}
        <div className="about-content">
          <span className="section-tag">About Fish Paradise</span>
          <h2 className="about-title">Your trusted partner for aquatic excellence</h2>

          <div className="about-block">
            <h3><i className="fas fa-anchor"></i> Our Story</h3>
            <p>
              We, Fish Paradise, situated at Chandra Layout, Bangalore, Karnataka, are a
              renowned name for providing complete solutions for all types of residential,
              commercial, modern and hi-tech aquariums.
            </p>
            <p>
              We have an understanding of space, light and design aesthetics which enables
              a seamless translation of a client vision into a living piece of art. We
              personally oversee each stage of the process to guarantee consistently high
              standards.
            </p>
          </div>

          <div className="about-block">
            <h3><i className="fas fa-cogs"></i> Our Services</h3>
            <ul className="services-list">
              {SERVICES.map((s, i) => (
                <li key={i}><i className="fas fa-check-circle"></i>{s}</li>
              ))}
            </ul>
          </div>

          <div className="about-block">
            <h3><i className="fas fa-star"></i> Why Choose Us</h3>
            <div className="why-grid">
              {WHY.map((w, i) => (
                <div className="why-card" key={i}>
                  <div className="why-icon"><i className={"fas " + w.icon}></i></div>
                  <div>
                    <h4>{w.title}</h4>
                    <p>{w.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}