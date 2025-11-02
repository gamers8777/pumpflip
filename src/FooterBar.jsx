// src/FooterBar.jsx
import React from 'react';

// Terima 'onLinkClick' sebagai prop dari App.jsx
function FooterBar({ onLinkClick }) {
  return (
    <div className="footer-bar">
      <div className="footer-left">
        <span>Pumpflip 2025</span>
      </div>
      <div className="footer-right">
        {/* Ganti <a> dengan <span> dan tambahkan onClick */}
        <span className="footer-link" onClick={() => onLinkClick('privacy')}>Privacy Policy</span>
        <span className="footer-link" onClick={() => onLinkClick('tos')}>Terms of Service</span>
        <span className="footer-link" onClick={() => onLinkClick('fees')}>Fees</span>
        <span className="footer-link" onClick={() => onLinkClick('updates')}>Tech Updates</span>
      </div>
    </div>
  );
}

export default FooterBar;