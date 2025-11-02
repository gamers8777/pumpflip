// src/CustomCursor.jsx (GANTI SEMUA ISINYA DENGAN INI)
import React, { useState, useEffect, useCallback } from 'react';
import Particle from './Particle'; // <-- Impor komponen partikel baru

// BATASAN: Hanya buat partikel baru setiap 30ms (throttle)
// Ini untuk mencegah ribuan partikel dibuat jika mouse digerakkan sangat cepat
const THROTTLE_DELAY = 30; 

function CustomCursor() {
  const [particles, setParticles] = useState([]);
  const [lastCall, setLastCall] = useState(0); // Untuk throttling

  // Fungsi untuk menghapus partikel dari state
  // Kita pakai useCallback agar fungsi ini stabil dan tidak dibuat ulang terus
  const removeParticle = useCallback((id) => {
    setParticles(prev => prev.filter(p => p.id !== id));
  }, []);

  // Event listener untuk mousemove
  const handleMouseMove = useCallback((e) => {
    const now = Date.now();
    
    // Terapkan throttling (jangan panggil fungsi jika terlalu cepat)
    if (now - lastCall < THROTTLE_DELAY) {
      return;
    }
    setLastCall(now);

    // Tambahkan partikel baru ke state array
    setParticles(prev => [
      ...prev,
      {
        id: now, // Gunakan timestamp sebagai ID unik
        x: e.clientX,
        y: e.clientY
      }
    ]);
  }, [lastCall]); // <-- dependency

  // Tambahkan listener saat komponen mount
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]); // <-- dependency

  return (
    <>
      {/* Kita tidak lagi merender panah atau glow.
        Kita hanya merender daftar partikel dari state.
      */}
      {particles.map(p => (
        <Particle
          key={p.id}
          id={p.id}
          x={p.x}
          y={p.y}
          onRemove={removeParticle}
        />
      ))}
    </>
  );
}

export default CustomCursor;