import React from 'react';
import './WhatsAppFloat.css';

const WA_NUM = process.env.REACT_APP_WA_NUMBER || '919886198869';

export default function WhatsAppFloat() {
  const url = 'https://wa.me/' + WA_NUM + '?text=Hello%20Fish%20Paradise%2C%20I%20am%20interested%20in%20an%20aquarium.';
  return (
    <a href={url} target="_blank" rel="noreferrer" className="wa-float" title="Chat on WhatsApp" aria-label="WhatsApp">
      <i className="fab fa-whatsapp"></i>
      <span className="wa-tooltip">Chat with us!</span>
    </a>
  );
}
