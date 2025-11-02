// src/ChatWindow.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react'; // Untuk mendapatkan wallet user

// Impor konfigurasi Firestore dan fungsi-fungsinya
import { db } from './firebaseConfig'; 
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  addDoc,
  serverTimestamp // Untuk stempel waktu server
} from "firebase/firestore";

// Fungsi helper untuk memotong alamat wallet
const shortenWallet = (wallet) => {
  if (!wallet) return 'ANON';
  return `${wallet.substring(0, 4)}...${wallet.substring(wallet.length - 4)}`;
};

function ChatWindow() {
  const { publicKey, connected } = useWallet(); // Cek koneksi wallet
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatContentRef = useRef(null); // Ref for auto-scroll

  // 1. Effect untuk mendengarkan pesan baru dari Firestore
  useEffect(() => {
    console.log("Connecting to Firestore chat...");

    // Kueri: koleksi 'chat', urutkan 'timestamp' (asc = lama ke baru), batasi 50
    const q = query(
      collection(db, "chat"), 
      orderBy("timestamp", "asc"), 
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData = [];
      querySnapshot.forEach((doc) => {
        messagesData.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messagesData); // Update state React
    
    }, (error) => {
        console.error("Error listening to chat:", error);
    });

    // Cleanup
    return () => {
      console.log("Disconnecting from Firestore chat.");
      unsubscribe();
    };

  }, []); // [] = jalankan sekali saja

  // 2. Effect untuk auto-scroll ke bawah saat ada pesan baru
  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [messages]); // Update saat 'messages' berubah

  // 3. Fungsi untuk mengirim pesan
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !connected || !publicKey) {
        if (!connected) alert("Connect wallet to chat!");
        return;
    }

    const walletAddress = publicKey.toBase58();

    try {
      // Tambahkan dokumen baru ke koleksi 'chat'
      await addDoc(collection(db, "chat"), {
        text: newMessage,
        wallet: walletAddress,
        timestamp: serverTimestamp() // Gunakan waktu server
      });
      
      setNewMessage(''); // Kosongkan input
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const isChatDisabled = !connected;

  return (
    <div className="chat-window"> {/* <--- Ganti nama class */}
      <div className="chat-title-bar"> {/* <--- Ganti nama class */}
        <span>[ global_chat.net ]</span>
        <span className={connected ? "status-connected" : "status-disconnected"}>
          {connected ? 'CONNECTED' : 'OFFLINE'}
        </span>
      </div>
      
      {/* Area Tampilan Pesan */}
      <div className="chat-content" ref={chatContentRef}>
        {messages.map(msg => (
          <div key={msg.id} className="chat-message">
            <span className="chat-message-wallet">{shortenWallet(msg.wallet)}:</span>
            <span className="chat-message-text">{msg.text}</span>
          </div>
        ))}
      </div>

      {/* Area Input Pesan */}
      <form className="chat-input-area" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="chat-input"
          placeholder={isChatDisabled ? "Connect wallet..." : "Type message..."}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={isChatDisabled}
        />
        <button 
          type="submit" 
          className="chat-send-btn" 
          disabled={isChatDisabled}
        >
          SEND
        </button>
      </form>
    </div>
  );
}

export default ChatWindow;