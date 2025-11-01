// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// Hapus analytics jika tidak perlu, tapi tambahkan getFirestore
import { getFirestore } from "firebase/firestore"; 

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVrdE1rRF8PbpV46bTqyF7e_gAYtFfE9I", // <--- AMANKAN KUNCI INI
  authDomain: "pumpflip-5b144.firebaseapp.com",
  projectId: "pumpflip-5b144",
  storageBucket: "pumpflip-5b144.firebasestorage.app",
  messagingSenderId: "56915837013",
  appId: "1:56915837013:web:fe681aee205a70a5c114dc",
  measurementId: "G-92T927NR9Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// --- INI YANG PENTING ---
// Inisialisasi Firestore dan ekspor
const db = getFirestore(app);

export { db };
