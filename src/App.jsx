// src/App.jsx
import React from 'react'; // Hapus useState, createContext, useContext
import './App.css'; 
import MatrixBackground from './MatrixBackground'; 
import CoinflipWindow from './CoinflipWindow'; 
import LiveFeedWindow from './LiveFeedWindow'; 
import ChatWindow from './ChatWindow'; // <--- INI SUDAH DITAMBAHKAN

// --- SEMUA KODE CONTEXT (FlipContext, useFlipContext, FlipProvider) DIHAPUS ---

function App() {
  return (
    // Bungkus hanya dengan Fragment (atau <>), bukan Provider lagi
    <>
      <MatrixBackground /> 

      <div className="app-container">
        {/* Window 1: Coinflip Game */}
        <CoinflipWindow />
        
        {/* Window 2: Live Feed */}
        <LiveFeedWindow />

        {/* Window 3: Chat Box */}
        <ChatWindow />
      </div>
    </>
  );
}

export default App;