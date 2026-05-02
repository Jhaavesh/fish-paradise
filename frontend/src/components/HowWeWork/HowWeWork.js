import React, { useEffect, useRef, useState } from 'react';
import howworkImg from '../../assets/howwework2.png';
import './HowWeWork.css';

const STEPS = [
  { num: '01', icon: 'fa-map-marker-alt', title: 'Site Visit',
    desc: 'Initial consultation: assessing space, logistics, and design goals.',
    color: '#00b4b4', bg: 'rgba(0,180,180,0.1)', border: 'rgba(0,180,180,0.4)' },
  { num: '02', icon: 'fa-drafting-compass', title: 'Concept Planning',
    desc: '3D visualization: designing bespoke aquascape and selection of unique flora and fauna.',
    color: '#17a369', bg: 'rgba(23,163,105,0.1)', border: 'rgba(23,163,105,0.4)' },
  { num: '03', icon: 'fa-tools', title: 'Executing Project',
    desc: 'Flawless installation: professional setup, component integration, and first life introduction.',
    color: '#6c5ce7', bg: 'rgba(108,92,231,0.1)', border: 'rgba(108,92,231,0.4)' },
  { num: '04', icon: 'fa-headset', title: 'Ongoing Support',
    desc: 'Scheduled maintenance, health checks, and dedicated after-sales care.',
    color: '#e17055', bg: 'rgba(225,112,85,0.1)', border: 'rgba(225,112,85,0.4)' },
];

function StepCard({ step, index }) {
  const ref = useRef();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={"how-step-card" + (visible ? ' visible' : '')}
      style={{ '--step-color': step.color, '--step-bg': step.bg, '--step-border': step.border, '--delay': index * 0.15 + 's' }}
    >
      <div className="hsc-top">
        <div className="hsc-num">{step.num}</div>
        <div className="hsc-icon-wrap"><i className={"fas " + step.icon}></i></div>
      </div>
      <h3 className="hsc-title">{step.title}</h3>
      <p className="hsc-desc">{step.desc}</p>
      <div className="hsc-line"></div>
    </div>
  );
}

export default function HowWeWork() {
  return (
    <section className="section how-section" id="how">
      <div className="container">
        <div className="how-header">
          <span className="section-tag">How We Work</span>
          <h2 className="section-title">From Vision to Reality</h2>
          <p className="section-sub">We handle every detail — from the first site visit to ongoing support — so your aquarium is perfect.</p>
        </div>

        <div className="how-steps-grid">
          {STEPS.map((s, i) => (
            <React.Fragment key={i}>
              <StepCard step={s} index={i} />
              {i < STEPS.length - 1 && (
                <div className="how-connector">
                  <div className="how-connector-line"></div>
                  <i className="fas fa-chevron-right how-connector-arrow"></i>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Real photo strip */}
        <div className="how-photo-strip">
          <img src={howworkImg} alt="Fish Paradise - Site Visit, Concept Planning, Executing Project" />
        </div>
      </div>
    </section>
  );
}
