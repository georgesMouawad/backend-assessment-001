import { createContext, useContext, useEffect, useState } from 'react';
import { SiweMessage } from 'siwe';
import { requestMethods, sendRequest } from '../tools/apiRequest';
import { useNavigate } from 'react-router-dom';
import { useAccountSubnames } from '@justaname.id/react';
import { BrowserProvider } from 'ethers';

const SiweContext = createContext<{
    signIn: () => Promise<void>;
    isAuthenticated: boolean;
    isAdminSubnameAvailable: boolean;
} | null>(null);
const ensDomain = import.meta.env.VITE_APP_ENS_DOMAIN as string;

// eslint-disable-next-line react-refresh/only-export-components
export const useSiwe = () => useContext(SiweContext);

export const SiweProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdminSubnameAvailable, setIsAdminSubnameAvailable] = useState(false);

    const navigate = useNavigate();
    // const { address } = useAccount();
    // const { signMessageAsync } = useSignMessage();
    const { subnames } = useAccountSubnames();

    const domain = window.location.host;
    const origin = window.location.origin;
    const provider = new BrowserProvider(window.ethereum);
    // const chainId = await provider.getNetwork();

    useEffect(() => {
        if (!isAuthenticated) return;
        checkAdminSubnames();
    }, [isAuthenticated, subnames]);

    const checkAdminSubnames = async () => {
        try {
            const checkResponse = await sendRequest(requestMethods.GET, `/auth/adminsubname?domain=${ensDomain}`);
            if (checkResponse.status !== 200) throw new Error();
            setIsAdminSubnameAvailable(checkResponse.data.admin);
        } catch (error) {
            console.log('Error checking for admin subname', error);
        }
    };

    const getSiweNonce = async () => {
        try {
            const nonceResponse = await sendRequest(requestMethods.GET, '/auth/nonce');
            if (nonceResponse.status !== 200) throw new Error();
            return nonceResponse.data;
        } catch (error) {
            console.log('Error getting nonce', error);
        }
    };

    const createSiweMessage = async (address: string, statement: string) => {
        const { nonce } = await getSiweNonce();

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

            if (verifyResponse.status !== 201) throw new Error();

            setIsAuthenticated(verifyResponse.data.authenticated);
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

            // console.log('Signer', signer)
            // console.log('Message', message);
            // console.log('Sig', signature);
            // console.log('Address', address);
            
            await authenticate(message, signature);

            navigate('/');
        } catch (error) {
            console.error('Error signing in with Ethereum:', error);
        }
    };

    return (
        <SiweContext.Provider value={{ signIn, isAuthenticated, isAdminSubnameAvailable }}>
            {children}
        </SiweContext.Provider>
    );
};
