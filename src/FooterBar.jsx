// src/FooterBar.jsx
import React from 'react';

// Terima 'onLinkClick' sebagai prop dari App.jsx
function FooterBar({ onLinkClick }) {
  return (
    <div className="footer-bar">
      
      {/* Kolom Kiri */}
      <div className="footer-left">
        <span>© Pumpflip 2025</span>
      </div>
      
      {/* Kolom Tengah (BARU) */}
      <div className="footer-center">
        <span className="footer-link" onClick={() => onLinkClick('privacy')}>Privacy Policy</span>
        <span className="footer-separator">|</span>
        <span className="footer-link" onClick={() => onLinkClick('tos')}>Terms of Service</span>
        <span className="footer-separator">|</span>
        <span className="footer-link" onClick={() => onLinkClick('fees')}>Fees</span>
        <span className="footer-separator">|</span>
        <span className="footer-link" onClick={() => onLinkClick('updates')}>Tech Updates</span>
      </div>

      {/* Kolom Kanan (Kosong, untuk menyeimbangkan layout) */}
      <div className="footer-right">
      </div>

    </div>
  );
}

export default FooterBar;