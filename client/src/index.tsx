import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { JustaNameProvider } from '@justaname.id/react';
import { sepolia } from 'wagmi/chains';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';

import App from './App';

import './index.css';
import '@rainbow-me/rainbowkit/styles.css';


// require('dotenv').config();
// const chainId = process.env.REACT_APP_CHAIN_ID ? parseInt(process.env.REACT_APP_CHAIN_ID) : undefined;
// const validChainId = chainId === 1 || chainId === 11155111 ? chainId : undefined;

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const config = getDefaultConfig({
    appName: 'My RainbowKit App',
    projectId: 'YOUR_PROJECT_ID',
    chains: [sepolia],
});

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <WagmiProvider config={config}>
                    <RainbowKitProvider>
                        <JustaNameProvider backendUrl={'http://localhost:3001'} chainId={11155111}>
                            <App />
                        </JustaNameProvider>
                    </RainbowKitProvider>
                </WagmiProvider>
            </QueryClientProvider>
        </BrowserRouter>
    </React.StrictMode>
);
