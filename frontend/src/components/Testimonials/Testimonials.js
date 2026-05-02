import React, { useState, useEffect } from 'react';
import './Testimonials.css';

const GOOGLE_REVIEW_URL = 'https://share.google/m1WnBx9zBvRmQBrwo';
const COLORS = ['#00b4b4','#17a369','#6c5ce7','#e17055','#0984e3','#fd79a8','#e17055'];

function Stars({ count }) {
  return (
    <div className="star-row">
      {[1,2,3,4,5].map(i => (
        <i key={i} className={"fas fa-star" + (i > count ? ' star-empty' : '')}></i>
      ))}
    </div>
  );
}

const GoogleG = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function Testimonials() {
  const [reviews,  setReviews]  = useState([]);
  const [rating,   setRating]   = useState(0);
  const [total,    setTotal]    = useState(0);
  const [active,   setActive]   = useState(0);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('/api/reviews')
      .then(r => r.json())
      .then(json => {
        if (json.success && json.data) {
          setReviews(json.data.reviews || []);
          setRating(json.data.rating   || 5);
          setTotal(json.data.totalRatings || 0);
          if ((json.data.reviews || []).length === 0) {
            setError('No reviews with 4+ stars found yet.');
          }
        } else {
          setError(json.message || 'Could not load reviews');
        }
      })
      .catch(err => setError('Backend not reachable: ' + err.message))
      .finally(() => setLoading(false));
  }, []);

  const prev = () => setActive(a => (a - 1 + reviews.length) % reviews.length);
  const next = () => setActive(a => (a + 1) % reviews.length);

  return (
    <section className="section testi-section" id="testimonials">
      <div className="container">

        {/* Header */}
        <div className="testi-header">
          <div className="testi-header-left">
            <span className="section-tag">Customer Reviews</span>
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-sub">
              {reviews.length > 0
                ? 'Real reviews from our Google Business profile'
                : 'Trusted by aquarium enthusiasts across India'}
            </p>
          </div>
          <div className="testi-header-right">
            {/* Google rating box */}
            <div className="google-rating-box">
              <div className="grb-logo"><GoogleG /></div>
              <div className="grb-info">
                <div className="grb-gname">Google</div>
                <div className="grb-score">{rating > 0 ? rating.toFixed(1) : '5.0'}</div>
                <Stars count={Math.round(rating || 5)} />
                <div className="grb-label">{total > 0 ? total + ' reviews' : 'Google Rating'}</div>
              </div>
            </div>
            <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noreferrer" className="write-review-btn">
              <GoogleG /> Write a Google Review
            </a>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="testi-loading">
            {[1,2,3].map(i => <div key={i} className="testi-skeleton" />)}
          </div>
        ) : error ? (
          <div className="testi-error">
            <i className="fas fa-exclamation-circle"></i>
            <p>{error}</p>
            <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noreferrer" className="write-review-btn" style={{marginTop:12}}>
              <GoogleG /> Be the first to review!
            </a>
          </div>
        ) : (
          <div className="testi-carousel-wrap">
            <div className="testi-cards-row">
              {reviews.map((r, i) => (
                <div key={i} className={"testi-card" + (i === active ? ' active' : '')}>
                  <div className="tc-top">
                    {r.photo ? (
                      <img src={r.photo} alt={r.author} className="tc-photo" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="tc-avatar" style={{ background: COLORS[i % COLORS.length] }}>
                        {r.author ? r.author.charAt(0).toUpperCase() : 'G'}
                      </div>
                    )}
                    <div className="tc-info">
                      <div className="tc-name">{r.author}</div>
                      <div className="tc-time">{r.time}</div>
                    </div>
                    <div className="tc-google-badge"><GoogleG /></div>
                  </div>
                  <Stars count={r.rating} />
                  <p className="tc-text">
                    {r.text && r.text.length > 220 ? r.text.slice(0, 220) + '...' : r.text}
                  </p>
                </div>
              ))}
            </div>

            {reviews.length > 1 && (
              <div className="testi-controls">
                <button className="tc-btn" onClick={prev} aria-label="Previous">
                  <i className="fas fa-chevron-left"></i>
                </button>
                <div className="tc-dots">
                  {reviews.map((_, i) => (
                    <button key={i} className={"tc-dot" + (i === active ? ' active' : '')}
                      onClick={() => setActive(i)} aria-label={"Review " + (i+1)} />
                  ))}
                </div>
                <button className="tc-btn" onClick={next} aria-label="Next">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}