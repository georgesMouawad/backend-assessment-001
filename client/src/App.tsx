import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { JustaNameProvider } from '@justaname.id/react';
import { mainnet, sepolia } from 'viem/chains';

import Home from './pages/Home/Home';

import './App.css';
import './styles/utilities.css';
import '@rainbow-me/rainbowkit/styles.css';
import { SiweProvider } from './core/data/SiweProvider';
import { Route, Routes } from 'react-router-dom';
import Admin from './pages/Admin/Admin';

const queryClient = new QueryClient();

function App() {
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

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    <JustaNameProvider
                        backendUrl={import.meta.env.VITE_APP_API_URL}
                        chainId={import.meta.env.VITE_APP_CHAIN_ID}
                        routes={routes}
                    >
                        <SiweProvider>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/admin" element={<Admin />} />
                            </Routes>
                        </SiweProvider>
                    </JustaNameProvider>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}

export default App;
