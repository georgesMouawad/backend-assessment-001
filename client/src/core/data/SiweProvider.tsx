import { createContext, useContext, useState } from 'react';
import { SiweMessage } from 'siwe';
import { useAccount, useSignMessage } from 'wagmi';
import { requestMethods, sendRequest } from '../tools/apiRequest';

const SiweContext = createContext<{ signIn: () => Promise<void>; isAuthenticated: boolean } | null>(null);

export const useSiwe = () => useContext(SiweContext);

export const SiweProvider = ({ children }: { children: React.ReactNode }) => {
    const { address } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const signIn = async () => {
        try {
            const nonceResponse = await sendRequest(requestMethods.GET, '/auth/nonce');

            if(nonceResponse.status !== 200) throw new Error('Error getting nonce')

            const { nonce } = nonceResponse.data;
            console.log('Nonce from api', nonce);
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

            // if(verifyResponse.status !== 200) throw new Error()

            console.log('Verfication Auth', verifyResponse);

            setIsAuthenticated(verifyResponse.data.authenticated);
        } catch (error) {
            console.error('Error signing in with Ethereum:', error);
        }
    };

    return <SiweContext.Provider value={{ signIn, isAuthenticated }}>{children}</SiweContext.Provider>;
};
