// src/App.jsx
import React, { useState } from 'react'; // 1. IMPORT useState
import './App.css'; 
import MatrixBackground from './MatrixBackground'; 
import CoinflipWindow from './CoinflipWindow'; 
import LiveFeedWindow from './LiveFeedWindow'; 
import ChatWindow from './ChatWindow'; 
import FooterBar from './FooterBar';
import InfoModal from './InfoModal'; // 2. IMPORT MODAL
import CustomCursor from './CustomCursor';

// --- 3. MODAL CONTENT (NOW IN ENGLISH) ---
// You MUST replace this placeholder text with your actual content.
const MODAL_DATA = {
  privacy: {
    title: "Privacy Policy",
    content: (
      <>
        <h2>1. Data We Collect</h2>
        <p>We collect your solana address when you connect to our service. We also store your chat data and flip results in our database to display in the Live Feed and Chat.</p>
        <h2>2. Data Usage</h2>
        <p>Your solana address is used to facilitate transactions (flips and chat messages) on the Solana blockchain and to display your activity.</p>
        <h2>3. Data Sharing</h2>
        <p>We do not share your personal information. Transaction and chat data are public by the nature of the blockchain and our service.</p>
      </>
    )
  },
  tos: {
    title: "Terms of Service",
    content: (
      <>
        <h2>1. Acceptance of Terms</h2>
        <p>By using Pumpflip, you agree to these terms. This is a decentralized application for entertainment purposes. Use at your own risk.</p>
        <h2>2. Risk</h2>
        <p>You acknowledge the high risk of cryptocurrency and gambling. You may lose all funds you use on this platform. We are not responsible for any losses.</p>
        <h2>3. No Warranty</h2>
        <p>This service is provided "as is" without any warranty.</p>
      </>
    )
  },
  fees: {
    title: "Fees",
    content: (
      <>
        <h2>Our Fee Structure</h2>
        <p>Pumpflip operates on a (centralized) provably fair system with a 49.9% house edge (49.9% win chance) to cover operational costs, gas fees, and development.</p>
        <p><strong>Coinflip Fee:</strong> Your chance of winning is 49.9%. If you win, you receive a 2x payout of your bet. The house edge is factored into this win probability.</p>
        <p><strong>Gas Fees (SOL):</strong> We pay all transaction (gas) fees for you via our backend relayer. You only need to sign the transaction. This cost is covered by our house edge.</p>
      </>
    )
  },
  updates: {
    title: "Tech Updates",
    content: (
      <>
        <h2>Version 1.0 (Nov 2025)</h2>
        <ul>
          <li>Initial release on Solana Devnet.</li>
          <li>Features: Coinflip, Live Transaction Feed, and Global Chat.</li>
          <li>Backend relayer implemented to cover user gas fees.</li>
        </ul>
      </>
    )
  }
};
// --- END OF MODAL CONTENT ---


function App() {
  // --- 4. STATE FOR THE MODAL ---
  const [modalContent, setModalContent] = useState(null); // null = closed

  // --- 5. FUNCTION TO OPEN THE MODAL ---
  const handleOpenModal = (pageKey) => {
    // 'pageKey' will be 'privacy', 'tos', 'fees', or 'updates'
    if (MODAL_DATA[pageKey]) {
      setModalContent(MODAL_DATA[pageKey]);
    }
  };

  // --- 6. FUNCTION TO CLOSE THE MODAL ---
  const handleCloseModal = () => {
    setModalContent(null);
  };

  return (
    <>
      <MatrixBackground /> 
      <CustomCursor />

      <div className="app-container">
        {/* Desktop order: Chat | Coinflip | LiveFeed */}
        <ChatWindow />
        <CoinflipWindow />
        <LiveFeedWindow />
      </div>

      {/* 7. Pass the 'handleOpenModal' function to the FooterBar */}
      <FooterBar onLinkClick={handleOpenModal} /> 

      {/* 8. Show the Modal if the state is not null */}
      {modalContent && (
        <InfoModal 
          title={modalContent.title}
          content={modalContent.content}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}

export default App;