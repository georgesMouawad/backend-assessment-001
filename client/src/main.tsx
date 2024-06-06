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
    addSubnameRoute: '/justaname/subdomain',
    revokeSubnameRoute: '/justaname/subdomain/revoke',
    requestChallengeRoute: '/justaname/requestchallenge',
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    <JustaNameProvider
                        backendUrl={import.meta.env.VITE_APP_API_URL}
                        chainId={import.meta.env.VITE_APP_CHAIN_ID}
                        routes={routes}
                    >
                        <SiweProvider>
                            <BrowserRouter>
                                <App />
                            </BrowserRouter>
                        </SiweProvider>
                    </JustaNameProvider>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    </React.StrictMode>
);
