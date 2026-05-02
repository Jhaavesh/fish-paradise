import React, { useEffect, useRef, useState } from 'react';
import './Stats.css';

const STATS = [
  { num: 5000, suffix: '+', label: 'Projects Done' },
  { num: 99,   suffix: '%', label: 'Satisfied Clients' },
  { num: 19,   suffix: '+', label: 'Years of Experience' },
  { num: 100,  suffix: '%', label: 'Custom Designs' },
];

function CountUp({ target, suffix, duration, start }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setVal(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return <>{val}{suffix}</>;
}

function StatItem({ stat }) {
  const ref = useRef();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div className="stat-item" ref={ref}>
      <div className="stat-num">
        <CountUp target={stat.num} suffix={stat.suffix} duration={1600} start={visible} />
      </div>
      <div className="stat-label">{stat.label}</div>
    </div>
  );
}

export default function Stats() {
  return (
    <div className="stats-bar" id="stats">
      <div className="stats-grid">
        {STATS.map((s, i) => <StatItem key={i} stat={s} />)}
      </div>
    </div>
  );
}
