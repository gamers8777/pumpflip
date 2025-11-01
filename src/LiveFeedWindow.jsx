// src/LiveFeedWindow.jsx
import React, { useState, useEffect, useRef } from 'react';

// --- BARU: Impor konfigurasi Firestore dan fungsi-fungsinya ---
import { db } from './firebaseConfig'; 
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";

// --- FUNGSI HELPER BARU UNTUK MEMOTONG ALAMAT WALLET ---
const shortenWallet = (wallet) => {
  if (!wallet) return '';
  return `${wallet.substring(0, 4)}...${wallet.substring(wallet.length - 4)}`;
};


// Live Feed Window Component
function LiveFeedWindow() {
  // --- BARU: State lokal untuk menyimpan transaksi dari Firestore ---
  const [liveTransactions, setLiveTransactions] = useState([]);
  const feedContentRef = useRef(null); // Ref for auto-scroll

  // --- BARU: Effect untuk mendengarkan Firestore ---
  useEffect(() => {
    console.log("Connecting to Firestore live feed...");

    // Buat kueri:
    // 1. Ambil koleksi 'flips'
    // 2. Urutkan berdasarkan 'timestamp' (desc = terbaru di atas)
    // 3. Batasi 50 dokumen terakhir
    const q = query(
      collection(db, "flips"), 
      orderBy("timestamp", "desc"), 
      limit(50)
    );

    // onSnapshot = pendengar real-time. 
    // Fungsi ini akan dipanggil setiap kali ada data baru di koleksi 'flips'
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const transactionsData = [];
      querySnapshot.forEach((doc) => {
        // Ambil data dokumen dan tambahkan 'id' uniknya
        transactionsData.push({ id: doc.id, ...doc.data() });
      });
      
      console.log("Live feed updated from Firestore:", transactionsData);
      setLiveTransactions(transactionsData); // Update state React
    
    }, (error) => {
        // Tangani error jika gagal mendengarkan
        console.error("Error listening to Firestore:", error);
    });

    // Cleanup: 
    // Saat komponen dibongkar (unmount), berhenti mendengarkan
    // untuk menghindari kebocoran memori.
    return () => {
      console.log("Disconnecting from Firestore feed.");
      unsubscribe();
    };

  }, []); // [] = jalankan effect ini sekali saja saat komponen pertama kali di-mount

  // Effect to auto-scroll to the top (newest entry)
  useEffect(() => {
    if (feedContentRef.current) {
      feedContentRef.current.scrollTop = 0; // Always scroll to top
    }
  }, [liveTransactions]); // Update saat transaksi baru masuk

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

        {/* Daftar transaksi (sekarang menggunakan data asli dari Firestore) */}
        {liveTransactions.map(tx => (
          <div key={tx.id} className="feed-line">
            <span className="wallet">{shortenWallet(tx.wallet)}</span>
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