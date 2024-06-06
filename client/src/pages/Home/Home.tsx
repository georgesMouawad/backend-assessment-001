import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useDebounce } from '@uidotdev/usehooks';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccountSubnames, useAddSubname, useIsSubnameAvailable, useRevokeSubname } from '@justaname.id/react';

import './index.css';

const Home = () => {
    const [username, setUsername] = useState<string>('');
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const ensDomain = import.meta.env.VITE_APP_ENS_DOMAIN as string;
    const { address } = useAccount();
    const { subnames } = useAccountSubnames();
    const { revokeSubname } = useRevokeSubname();
    const { addSubname } = useAddSubname();
    const debouncedUsername = useDebounce(username, 500);
    const { isAvailable, isLoading } = useIsSubnameAvailable({
        username: debouncedUsername,
        ensDomain,
    });

    console.log(subnames);

    return (
        <div className="full">
            <div className="claimed">
                <h3>Claimed Domains under {ensDomain}</h3>
                <div className="subnames-container">
                    {subnames.map((subname) =>
                        subname.username ? (
                            <span
                                key={subname.id}
                                className="subname-item"
                                onClick={() => revokeSubname({ username: subname.username })}
                            >
                                {subname.subname}
                            </span>
                        ) : null
                    )}
                </div>
            </div>
            <div className="full flex column center">
                {!address ? (
                    <>
                        <h1>Connect Your Wallet</h1>
                        <ConnectButton />
                    </>
                ) : (
                    <>
                        <div className="full-width flex column center gap-m">
                            <h1>Claim Your ENS Subdomain</h1>
                            <div className="full-width flex row center">
                                <input
                                    type="text"
                                    value={username}
                                    className="claim-input"
                                    placeholder="Enter a subdomain"
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <button
                                    className="claim-btn button bold size-l flex center"
                                    onClick={() => addSubname({ username })}
                                    disabled={!isAvailable || !address || !debouncedUsername}
                                >
                                    Claim
                                </button>
                            </div>
                            <label className="flex gap-s center">
                                Admin Subdomain:
                                <input type="checkbox" checked={isAdmin} onChange={() => setIsAdmin(!isAdmin)} />
                            </label>
                        </div>
                        <div className="newdomain-info">
                            {isLoading && <p>Checking availability...</p>}
                            {isAvailable && debouncedUsername && <p className="valid">Subname available</p>}
                            {debouncedUsername && !isAvailable && <p className="error">Subname not available</p>}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;
