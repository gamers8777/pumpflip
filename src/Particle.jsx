// src/Particle.jsx
import React, { useEffect } from 'react';

// Berapa lama partikel akan hidup (dalam milidetik)
const PARTICLE_LIFESPAN = 800; // 0.8 detik

function Particle({ id, x, y, onRemove }) {
  
  // Efek ini akan berjalan HANYA SEKALI saat partikel ini dibuat
  useEffect(() => {
    // Kita set timer untuk "membunuh" partikel ini
    const timer = setTimeout(() => {
      onRemove(id); // Panggil fungsi untuk menghapusnya dari state
    }, PARTICLE_LIFESPAN);

    // Bersihkan timer jika komponen keburu hancur
    return () => clearTimeout(timer);
  }, [id, onRemove]); // <-- Dependency array

  // Kita juga bisa tambahkan sedikit acak pada posisi akhir (via CSS)
  const style = {
    left: `${x}px`,
    top: `${y}px`,
  };

  return (
    <div className="particle" style={style} />
  );
}

export default Particle;