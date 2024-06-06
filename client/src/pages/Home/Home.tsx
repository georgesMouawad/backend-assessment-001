import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import SubnameClaim from '../../components/SubnameClaim/SubnameClaim';
import SubnamesClaimed from '../../components/SubnamesClaimed/SubnamesClaimed';

import './index.css';
import { useSiwe } from '../../core/data/SiweProvider';

const Home = () => {
    const { address } = useAccount();
    const siwe = useSiwe();
    const signIn = siwe?.signIn;
    const isAuthenticated = siwe?.isAuthenticated;

    return (
        <div className="full">
            {address && <SubnamesClaimed />}
            <div className="full flex column center">
                {!address ? (
                    <>
                        <h1>Connect Your Wallet</h1>
                        <ConnectButton />
                    </>
                ) : (
                    <SubnameClaim />
                )}
            </div>
            {!isAuthenticated && (
                <div className="flex column center">
                    <button onClick={signIn} className="primary-btn btn-l border-radius">
                        Sign in with Ethereum
                    </button>
                </div>
            )}
        </div>
    );
};

export default Home;
