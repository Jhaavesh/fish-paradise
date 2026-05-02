import React, { useState } from 'react';
import toast from 'react-hot-toast';
import './Contact.css';

const WA_NUM = process.env.REACT_APP_WA_NUMBER || '919886198869';
const GOOGLE_REVIEW_URL = 'https://share.google/m1WnBx9zBvRmQBrwo';

const INFO = [
  { icon: 'fa-map-marker-alt', title: 'Visit Us',
    content: <p>No 33, Opposite Health and Glow<br />7th Main Road, BHBC Society<br />Chandra Layout, Bangalore<br />Karnataka - 560040</p> },
  { icon: 'fa-phone-alt', title: 'Call Us',
    content: <><a href="tel:+919886198869">+91-9886198869</a><br /><a href="tel:+919964971869">+91-9964971869</a></> },
  { icon: 'fa-envelope', title: 'Email Us',
    content: <a href="mailto:support@fishparadise.in">support@fishparadise.in</a> },
  { icon: 'fa-clock', title: 'Business Hours',
    content: <p>Monday - Saturday: 10:00 AM - 8:00 PM<br />Sunday: 11:00 AM - 6:00 PM</p> },
];

const SERVICES = [
  'Custom Aquarium Design and Installation',
  'Residential Aquarium Solution',
  'Commercial Aquarium Solution',
  'Hi-Tech Aquarium System',
  'Maintenance and Support',
  'Product Purchase',
];

const INIT = { firstName: '', lastName: '', email: '', phone: '', service: '', message: '' };

export default function Contact() {
  const [form,      setForm]      = useState(INIT);
  const [loading,   setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.email || !form.message) {
      toast.error('Name, email and message are required');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed');
      setSubmitted(true);
      setForm(INIT);
      toast.success('Message sent! We will get back to you soon.');
    } catch {
      const saved = JSON.parse(localStorage.getItem('fp_enquiries') || '[]');
      saved.push({ ...form, timestamp: new Date().toISOString() });
      localStorage.setItem('fp_enquiries', JSON.stringify(saved));
      setSubmitted(true);
      setForm(INIT);
      toast.success('Message received! We will contact you within 24 hours.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section contact-section" id="contact">
      <div className="contact-container container">
        <div className="contact-title-wrap">
          <span className="section-tag">Get In Touch</span>
          <h2 className="section-title">We would love to hear from you</h2>
          <p className="section-sub">Reach out for custom aquarium solutions, product queries, or just to say hello!</p>
        </div>

        <div className="contact-layout">
          {/* LEFT info cards */}
          <div className="contact-info">
            {INFO.map((c, i) => (
              <div className="contact-card" key={i}>
                <div className="cc-icon"><i className={"fas " + c.icon}></i></div>
                <div className="cc-body"><h4>{c.title}</h4><div className="cc-content">{c.content}</div></div>
              </div>
            ))}
            {/* Google Review card */}
            <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noreferrer" className="google-review-card">
              <div className="grc-icon">
                <svg viewBox="0 0 24 24" width="26" height="26" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <div className="grc-body">
                <h4>Rate Us on Google</h4>
                <div className="grc-stars">
                  {[1,2,3,4,5].map(i => <i key={i} className="fas fa-star"></i>)}
                  <span>5.0</span>
                </div>
                <p>Share your experience &rarr; Write a review</p>
              </div>
            </a>
          </div>

          {/* RIGHT form */}
          <div className="contact-form-box">
            <h3>Send us a Message</h3>
            <p className="cf-sub">Fill the form and we will get back to you within 24 hours.</p>

            {submitted ? (
              <div className="cf-success">
                <i className="fas fa-check-circle"></i>
                <div>
                  <strong>Message sent successfully!</strong>
                  <p>We will get back to you within 24 hours.</p>
                </div>
                <button onClick={() => setSubmitted(false)} className="btn-outline" style={{ marginTop: 16 }}>
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="cf-row">
                  <div className="cf-group">
                    <label>First Name *</label>
                    <input type="text" placeholder="Rahul" value={form.firstName}
                      onChange={(e) => set('firstName', e.target.value)} required />
                  </div>
                  <div className="cf-group">
                    <label>Last Name</label>
                    <input type="text" placeholder="Sharma" value={form.lastName}
                      onChange={(e) => set('lastName', e.target.value)} />
                  </div>
                </div>
                <div className="cf-row">
                  <div className="cf-group">
                    <label>Email *</label>
                    <input type="email" placeholder="you@email.com" value={form.email}
                      onChange={(e) => set('email', e.target.value)} required />
                  </div>
                  <div className="cf-group">
                    <label>Phone</label>
                    <input type="tel" placeholder="+91 98861 98869" value={form.phone}
                      onChange={(e) => set('phone', e.target.value)} />
                  </div>
                </div>
                <div className="cf-group">
                  <label>Service Interested In</label>
                  <select value={form.service} onChange={(e) => set('service', e.target.value)}>
                    <option value="">Select a service</option>
                    {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="cf-group">
                  <label>Message *</label>
                  <textarea rows={5} placeholder="Tell us about your dream aquarium..."
                    value={form.message} onChange={(e) => set('message', e.target.value)} required />
                </div>
                <button type="submit" className="btn-primary cf-submit" disabled={loading}>
                  {loading
                    ? <><i className="fas fa-spinner fa-spin"></i> Sending...</>
                    : <>Send Message <i className="fas fa-paper-plane"></i></>}
                </button>
                <a
                  href={"https://wa.me/" + WA_NUM + "?text=Hello%20Fish%20Paradise%2C%20I%20am%20interested%20in%20an%20aquarium."}
                  target="_blank" rel="noreferrer" className="wa-alt-btn"
                >
                  <i className="fab fa-whatsapp"></i> Or chat on WhatsApp
                </a>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
