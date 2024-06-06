import { createContext, useContext, useEffect, useState } from 'react';
import { SiweMessage } from 'siwe';
import { useAccount, useSignMessage } from 'wagmi';
import { requestMethods, sendRequest } from '../tools/apiRequest';
import { useNavigate } from 'react-router-dom';

const SiweContext = createContext<{ signIn: () => Promise<void>; isAuthenticated: boolean } | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useSiwe = () => useContext(SiweContext);

export const SiweProvider = ({ children }: { children: React.ReactNode }) => {
    const { address } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const signIn = async () => {
        try {
            const nonceResponse = await sendRequest(requestMethods.GET, '/auth/nonce');

            if (nonceResponse.status !== 200) throw new Error('Error getting nonce');

            const { nonce } = nonceResponse.data;

            const message = new SiweMessage({
                domain: 'localhost:5173',
                address,
                statement: 'Sign in with Ethereum',
                uri: 'http://localhost:5173',
                version: '1',
                chainId: import.meta.env.VITE_APP_CHAIN_ID as number,
                nonce,
            });

            const preparedMessage = message.prepareMessage();

            const signature = await signMessageAsync({ message: preparedMessage });

            const verifyResponse = await sendRequest(requestMethods.POST, '/auth/authenticate', {
                message: preparedMessage,
                signature,
            });

            if (verifyResponse.status !== 201) throw new Error();
            console.log('Here');

            setIsAuthenticated(verifyResponse.data.authenticated);
        } catch (error) {
            console.error('Error signing in with Ethereum:', error);
        }
    };

    return <SiweContext.Provider value={{ signIn, isAuthenticated }}>{children}</SiweContext.Provider>;
};
