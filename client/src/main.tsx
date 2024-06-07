import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { SiweProvider } from './core/data/SiweProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { JustaNameProvider } from '@justaname.id/react';
import { mainnet, sepolia } from 'viem/chains';

import App from './App.tsx';

import './index.css';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

const config = getDefaultConfig({
    appName: 'My RainbowKit App',
    projectId: 'YOUR_PROJECT_ID',
    chains: import.meta.env.VITE_APP_CHAIN_ID === 1 ? [mainnet] : [sepolia],
});

const routes = {
    addSubnameRoute: '/justaname/subname',
    revokeSubnameRoute: '/justaname/subname/revoke',
    requestChallengeRoute: '/justaname/requestchallenge',
};

// const customTheme = {
//     colors: {
//       connectButtonBackground: '#f76707',
//       connectButtonText: '#FFFFFF',
//       connectButtonBackgroundError: '#FF4A4A',
//     },
//     fonts: {
//       body: 'Open Sans, sans-serif',
//     },
//   };

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <WagmiProvider config={config}>
                <QueryClientProvider client={queryClient}>
                    <RainbowKitProvider>
                        <JustaNameProvider
                            backendUrl={import.meta.env.VITE_APP_API_URL}
                            chainId={import.meta.env.VITE_APP_CHAIN_ID}
                            routes={routes}
                        >
                            <SiweProvider>
                                <App />
                            </SiweProvider>
                        </JustaNameProvider>
                    </RainbowKitProvider>
                </QueryClientProvider>
            </WagmiProvider>
        </BrowserRouter>
    </React.StrictMode>
);
