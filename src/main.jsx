import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; 

// === Imports for Solana Wallet Adapter ===
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';

// === Import CSS for Wallet Buttons ===
import '@solana/wallet-adapter-react-ui/styles.css';

// Wrapper component to set up providers
const SolanaAppWrapper = () => {
    // Change to 'mainnet-beta' when you go live
    const network = WalletAdapterNetwork.Devnet; 
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
        ],
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <App /> 
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

// Render the React app
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <SolanaAppWrapper />
    </React.StrictMode>
);