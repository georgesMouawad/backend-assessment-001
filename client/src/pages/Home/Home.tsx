import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import SubnameClaim from '../../components/SubnameClaim/SubnameClaim';
import SubnamesClaimed from '../../components/SubnamesClaimed/SubnamesClaimed';

import './index.css';

const Home = () => {
    const { address } = useAccount();
    return (
        <div className="full">
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
            {address && <SubnamesClaimed />}
        </div>
    );
};

export default Home;
