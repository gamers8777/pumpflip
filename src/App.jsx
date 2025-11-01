import React from 'react';
import './App.css'; 
import MatrixBackground from './MatrixBackground'; 
import CoinflipWindow from './CoinflipWindow'; 
import LiveFeedWindow from './LiveFeedWindow'; 

function App() {
  return (
    <> 
      <MatrixBackground /> 

      <div className="app-container">
        {/* Window 1: Coinflip Game */}
        <CoinflipWindow />
        
        {/* Window 2: Live Feed */}
        <LiveFeedWindow />
      </div>
    </>
  );
}

export default App;