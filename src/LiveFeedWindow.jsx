import React, { useState, useEffect, useRef } from 'react';

// --- HELPER FUNCTIONS FOR FEED SIMULATION ---
const fakeWallets = ['3z...yM2', '8T...gA1', 'Fp...kR4', '9j...LwP', 'Gw...pU8'];
const fakeAmounts = [0.1, 0.25, 0.5, 1.0, 2.0];
const fakeChoices = ['HEADS', 'TAILS'];

const createFakeTransaction = () => {
  const wallet = fakeWallets[Math.floor(Math.random() * fakeWallets.length)];
  const amount = fakeAmounts[Math.floor(Math.random() * fakeAmounts.length)];
  const choice = fakeChoices[Math.floor(Math.random() * fakeChoices.length)];
  const result = Math.random() < 0.5 ? 'WON' : 'LOST';
  return { id: Date.now(), wallet, amount, choice, result };
};

// Live Feed Window Component
function LiveFeedWindow() {
  const [liveTransactions, setLiveTransactions] = useState([]);
  const feedContentRef = useRef(null); // Ref for auto-scroll

  // Effect for simulating the feed
  useEffect(() => {
    // Create some initial fake transactions
    const initialTxs = [createFakeTransaction(), createFakeTransaction(), createFakeTransaction()];
    setLiveTransactions(initialTxs);

    // Set interval to add new fake transactions
    const feedInterval = setInterval(() => {
      const newTx = createFakeTransaction();
      
      // Add new tx to the top, limit to 100 entries (for scrolling)
      setLiveTransactions(prev => [newTx, ...prev].slice(0, 100)); 

    }, 3000 + Math.random() * 2000); // Random interval between 3-5 seconds

    return () => clearInterval(feedInterval); // Clean up on unmount
  }, []);

  // Effect to auto-scroll to the top (newest entry)
  useEffect(() => {
    if (feedContentRef.current) {
      feedContentRef.current.scrollTop = 0; // Always scroll to top
    }
  }, [liveTransactions]);

  return (
    <div className="live-feed-window">
      <div className="feed-title-bar">
        <span>[ live transactions ]</span>
        <span className="status-live">LIVE</span>
      </div>
      <div className="feed-content" ref={feedContentRef}>
        {/* Initial logs */}
        <div className="feed-line">
          <span className="action">&gt; Connecting to SOLFLIP protocol...</span>
        </div>
        <div className="feed-line">
          <span className="action">&gt; STATUS: </span>
          <span className="result-win">CONNECTED</span>
        </div>
        <div className="feed-line">
          <span className="action">&gt; Awaiting live data...</span>
          <span className="cursor-blink">_</span>
        </div>
        <br /> 

        {/* Transaction list */}
        {liveTransactions.map(tx => (
          <div key={tx.id} className="feed-line">
            <span className="wallet">{tx.wallet}</span>
            <span className="action"> flipped </span>
            <span className="amount">{tx.amount} SOL</span>
            <span className="action"> on </span>
            <span className="choice">{tx.choice}</span>
            <span className="action"> and </span>
            <span className={tx.result === 'WON' ? 'result-win' : 'result-lose'}>
              {tx.result}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LiveFeedWindow;