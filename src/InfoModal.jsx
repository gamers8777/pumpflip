// src/InfoModal.jsx
import React from 'react';

function InfoModal({ title, content, onClose }) {
  return (
    // Latar belakang gelap
    <div className="modal-overlay" onClick={onClose}>
      
      {/* Konten Jendela */}
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        
        {/* Judul dan Tombol Close */}
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close-btn" onClick={onClose}>
            X
          </button>
        </div>
        
        {/* Konten yang bisa di-scroll */}
        <div className="modal-content">
          {content}
        </div>
      </div>
    </div>
  );
}

export default InfoModal;