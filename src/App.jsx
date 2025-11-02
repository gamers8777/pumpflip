// src/App.jsx
import React from 'react';
import './App.css'; 
import MatrixBackground from './MatrixBackground'; 
import CoinflipWindow from './CoinflipWindow'; 
import LiveFeedWindow from './LiveFeedWindow'; 
import ChatWindow from './ChatWindow'; 

function App() {
  return (
    <>
      <MatrixBackground /> 

      <div className="app-container">
        
        {/* Window 1: Chat Box (Sekarang di kiri) */}
        <ChatWindow />

        {/* Window 2: Coinflip Game (Sekarang di tengah) */}
        <CoinflipWindow />
        
        {/* Window 3: Live Feed (Sekarang di kanan) */}
        <LiveFeedWindow />

      </div>
    </>
  );
}

export default App;