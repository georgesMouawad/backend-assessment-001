import { AxiosError } from 'axios';
import { SiweMessage } from 'siwe';
import { BrowserProvider } from 'ethers';
import { useNavigate } from 'react-router-dom';
import { useAccountSubnames } from '@justaname.id/react';
import { requestMethods, sendRequest } from '../tools/apiRequest';
import { createContext, useContext, useEffect, useState } from 'react';

const SiweContext = createContext<{
    signIn: () => Promise<void>;
    isAuthenticated: boolean;
    isAdminSubnameAvailable: boolean;
} | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useSiwe = () => useContext(SiweContext);

export const SiweProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdminSubnameAvailable, setIsAdminSubnameAvailable] = useState(false);

    const navigate = useNavigate();
    const { subnames } = useAccountSubnames();

    const domain = window.location.host;
    const origin = window.location.origin;
    const provider = new BrowserProvider(window.ethereum);

    useEffect(() => {
        isAuthenticated && checkAdminSubnames();
        window.ethereum &&
            window.ethereum.on('accountsChanged', (accounts: string[]) => {
                if (accounts.length === 0) {
                    clearSession();
                }
            });

        return () => {
            window.ethereum && window.ethereum.off('accountsChanged', clearSession);
        };
    }, [isAuthenticated, subnames]);

    useEffect(() => {
        !isAuthenticated && checkSession();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const checkAdminSubnames = async () => {
        try {
            const checkResponse = await sendRequest(requestMethods.GET, `/auth/check-admin`);
            if (checkResponse && checkResponse.status === 200) {
                setIsAdminSubnameAvailable(checkResponse.data);
            }
        } catch (error) {
            console.log('Error checking for admin subname', error);
        }
    };

    const getSiweNonce = async () => {
        try {
            const nonceResponse = await sendRequest(requestMethods.GET, '/auth/nonce');
            if (nonceResponse && nonceResponse.status === 201) {
                return nonceResponse.data;
            }
        } catch (error) {
            console.log('Error getting nonce', error);
        }
    };

    const createSiweMessage = async (address: string, statement: string) => {
        const nonce = await getSiweNonce();

        const message = new SiweMessage({
            domain,
            address,
            statement,
            uri: origin,
            version: '1',
            chainId: import.meta.env.VITE_APP_CHAIN_ID as number,
            nonce,
        });

        return message.prepareMessage();
    };

    const connectWallet = () =>
        provider.send('eth_requestAccounts', []).catch(() => console.log('User reject request to connect wallet'));

    const authenticate = async (message: string, signature: string) => {
        try {
            const verifyResponse = await sendRequest(requestMethods.POST, '/auth/authenticate', {
                message,
                signature,
            });

            verifyResponse && setIsAuthenticated(verifyResponse.data);
        } catch (error) {
            console.log('Error Authenticating', error);
        }
    };

    const signIn = async () => {
        try {
            await connectWallet();

            const statement = 'Sign in with Ethereum';
            const signer = await provider.getSigner();
            const address = signer.address;
            const message = await createSiweMessage(address, statement);
            const signature = await signer.signMessage(message);

            await authenticate(message, signature);
            navigate('/');
            
        } catch (error) {
            console.error('Error signing in with Ethereum:', error);
        }
    };

    const checkSession = async () => {
        try {
            const response = await sendRequest(requestMethods.GET, '/auth/check-session');
            if (response && response.status === 200) {
                setIsAuthenticated(true);
            }
        } catch (error) {
            if ((error as AxiosError).response?.status === 403) {
                setIsAuthenticated(false);
            } else {
                console.log('Error checking session:', error);
            }
        }
    };

    const clearSession = async () => {
        try {
            await sendRequest(requestMethods.POST, '/auth/logout');
            setIsAuthenticated(false);
        } catch (error) {
            console.log('Error clearing session:', error);
        }
    };

    return (
        <SiweContext.Provider value={{ signIn, isAuthenticated, isAdminSubnameAvailable }}>
            {children}
        </SiweContext.Provider>
    );
};
