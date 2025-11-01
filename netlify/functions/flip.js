// flip.js
const express = require('express');
const { 
    Connection, 
    Transaction, 
    SystemProgram, 
    PublicKey, 
    Keypair, 
    LAMPORTS_PER_SOL,
    sendAndConfirmRawTransaction,
    TransactionInstruction // <--- PASTIKAN INI DITAMBAHKAN
} = require('@solana/web3.js');
const cors = require('cors');
const serverless = require('serverless-http'); 
require('dotenv').config();

// --- BARU: Impor Firebase Admin ---
const admin = require('firebase-admin');

// --- BARU: Inisialisasi Firebase Admin ---
// Ambil kredensial dari variabel lingkungan Netlify
try {
  // Pastikan variabel lingkungan ini sudah Anda atur di Netlify
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

  if (admin.apps.length === 0) { // Cek agar tidak inisialisasi berulang
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
} catch (e) {
  console.error("Error initializing Firebase Admin:", e.message);
  console.error("Pastikan FIREBASE_SERVICE_ACCOUNT di Netlify sudah di-set dengan benar.");
}

const db = admin.firestore(); // Dapatkan instance Firestore
// --- AKHIR BARU ---


const app = express();
app.use(cors());
app.use(express.json());

// --- KONFIGURASI (DEVNET) ---
const SOLANA_RPC = "https://api.devnet.solana.com";
const connection = new Connection(SOLANA_RPC, 'confirmed');
// Alamat wallet bandar di-hardcode (Devnet)
const houseWalletAddress = new PublicKey("hivWuGJHMnHNKAA5mqHxU5k1731XwQNbs8TKd22yLsT");
// --------------------

const router = express.Router();

// --- FUNGSI UNTUK MEMUAT WALLET RELAYER ---
function getRelayerWallet() {
  const relayerSecretKeyString = process.env.RELAYER_PRIVATE_KEY;
  if (!relayerSecretKeyString) {
    throw new Error("RELAYER_PRIVATE_KEY is not set in environment variables");
  }
  
  try {
    const relayerSecretKey = Uint8Array.from(JSON.parse(relayerSecretKeyString));
    if (relayerSecretKey.length !== 64) {
      throw new Error("Invalid private key length. Must be 64 bytes.");
    }
    return Keypair.fromSecretKey(relayerSecretKey);
  } catch (err) {
    console.error("Failed to parse RELAYER_PRIVATE_KEY:", err.message);
    throw new Error("Failed to load relayer wallet. Check private key format.");
  }
}

// Endpoint 1: Create Transaction
router.post('/create-flip', async (req, res) => {
    try {
        const relayerWallet = getRelayerWallet();
        
        // Ambil 'choice' dari body
        const { userWallet, amount, choice } = req.body; 
        if (!userWallet || !amount || !choice) { // Pastikan choice ada
            return res.status(400).json({ error: 'Missing userWallet, amount, or choice' });
        }
        console.log(`[CREATE] Received flip request for ${amount} SOL from ${userWallet} (Choice: ${choice})`);

        const userPublicKey = new PublicKey(userWallet);
        const lamports = amount * LAMPORTS_PER_SOL;

        const transferInstruction = SystemProgram.transfer({
            fromPubkey: userPublicKey,
            toPubkey: houseWalletAddress,
            lamports: lamports,
        });

        const transaction = new Transaction().add(transferInstruction);
        transaction.feePayer = relayerWallet.publicKey; 
        
        const { blockhash } = await connection.getLatestBlockhash('finalized');
        transaction.recentBlockhash = blockhash;

        // --- BARU: Simpan 'choice' di dalam transaksi menggunakan Memo ---
        transaction.add(
            new TransactionInstruction({
                keys: [], // Tidak perlu key untuk memo
                programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"), // Program ID Memo Solana
                data: Buffer.from(choice, "utf-8"), // Simpan 'heads' atau 'tails'
            })
        );
        // --- AKHIR BARU ---

        const serializedTransaction = transaction.serialize({
            requireAllSignatures: false,
        });

        console.log(`[CREATE] Transaction created, sending to frontend for signature`);
        res.json({ transaction: serializedTransaction.toString('base64') });

    } catch (error) {
        console.error('[CREATE] Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint 2: Submit Transaction & Coinflip
router.post('/submit-flip', async (req, res) => {
    try {
        const relayerWallet = getRelayerWallet();

        const { signedTransaction } = req.body;
        if (!signedTransaction) {
            return res.status(400).json({ error: 'Missing signedTransaction' });
        }
        console.log(`[SUBMIT] Received signed transaction from user`);

        const transaction = Transaction.from(Buffer.from(signedTransaction, 'base64'));
        
        // --- BARU: Ekstrak data dari transaksi ---
        const userWallet = transaction.instructions[0].keys[0].pubkey.toBase58();
        const betAmountLamports = transaction.instructions[0].data.readBigUInt64LE(4);
        const betAmountSOL = Number(betAmountLamports) / LAMPORTS_PER_SOL;
        
        // Temukan instruksi memo untuk mendapatkan 'choice'
        const memoInstruction = transaction.instructions.find(inst => inst.programId.toBase58() === "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");
        const choice = memoInstruction ? memoInstruction.data.toString('utf-8') : 'unknown'; // 'heads' atau 'tails'
        // --- AKHIR BARU ---
        
        transaction.feePayer = relayerWallet.publicKey;
        transaction.partialSign(relayerWallet); 

        console.log(`[SUBMIT] Sending transaction (bet) to network...`);
        const signature = await sendAndConfirmRawTransaction(
            connection,
            transaction.serialize(),
            { commitment: 'confirmed' }
        );
        console.log(`[SUBMIT] Bet accepted! Signature: ${signature}`);

        // --- COINFLIP LOGIC (CENTRALIZED) ---
        // Peluang 30% untuk menang (0.3)
        const userWon = Math.random() < 0.3; // 30% chance 
        const result = userWon ? 'WON' : 'LOST';

        let payoutSignature = null;
        let message = '';

        if (userWon) {
            console.log(`[FLIP] User WON! Sending prize...`);
            // Pembayaran tetap 2x lipat
            const payoutAmount = Number(betAmountLamports) * 2; 
            
            const payoutTx = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: relayerWallet.publicKey,
                    toPubkey: new PublicKey(userWallet),
                    lamports: payoutAmount,
                })
            );
            payoutTx.recentBlockhash = (await connection.getLatestBlockhash('finalized')).blockhash;
            payoutTx.feePayer = relayerWallet.publicKey;
            
            payoutSignature = await connection.sendTransaction(payoutTx, [relayerWallet]);
            await connection.confirmTransaction(payoutSignature, 'confirmed');

            console.log(`[FLIP] Prize sent! Payout Signature: ${payoutSignature}`);
            message = 'YOU WON! PROFIT GAINED.';

        } else {
            console.log(`[FLIP] User LOST.`);
            message = 'YOU LOST! LOSS INCURRED.';
        }

        // --- BARU: Tulis hasil ke Firestore ---
        try {
            await db.collection('flips').add({
                wallet: userWallet,
                amount: betAmountSOL,
                choice: choice.toUpperCase(), // 'heads' -> 'HEADS'
                result: result, // 'WON' atau 'LOST'
                timestamp: admin.firestore.FieldValue.serverTimestamp() // Waktu server
            });
            console.log('[FIRESTORE] Flip result saved to database.');
        } catch (dbError) {
            console.error('[FIRESTORE] FAILED TO SAVE FLIP RESULT:', dbError);
            // Tetap lanjutkan meski gagal menyimpan, agar user frontend dapat hasil
        }
        // --- AKHIR BARU ---

        // Kirim respons kembali ke frontend
        res.json({ 
            success: true, 
            result: result, 
            message: message, 
            betTx: signature, 
            payoutTx: payoutSignature 
        });

    } catch (error) {
        console.error('[SUBMIT] Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Point all requests to our router
app.use('/.netlify/functions/flip', router); // For local dev
app.use('/api', router); // For production (from redirect)

// Wrap the app for Netlify
module.exports.handler = serverless(app);