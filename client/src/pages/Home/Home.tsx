import React, { useEffect, useState } from 'react';
import { requestMethods, sendRequest } from '../../core/tools/apiRequest';
import { useIsSubnameAvailable } from '@justaname.id/react';
import { useAddSubname } from '@justaname.id/react';
import { useAccount } from 'wagmi';

import './index.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Home = () => {
    const [username, setUsername] = useState<string>('');
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    const { address } = useAccount();
    const { addSubname, addSubnamePending } = useAddSubname();
    const { isAvailable, isLoading } = useIsSubnameAvailable({ username, ensDomain: 'georgesmwd.eth' });

    const handleClaim = async () => {
        // console.log(username, isAdmin);

        // try {
        //     const response = await sendRequest(requestMethods.POST, '/justaname/subdomain', { username });
        //     console.log(response.data);
        //     setUsername('');
        //     setIsAdmin(false);
        // } catch (error) {
        //     console.log('Error Claiming Subdomain: ', error);
        // }

        try {
            await addSubname({ username });
            console.log('Subname claimed successfully!');
        } catch (error) {
            console.error('Failed to claim subname:', error);
        }
    };

    return (
        <div className="full flex column center">
            {!address ? (
                <ConnectButton />
            ) : (
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
                            className="claim-btn button bold size-l"
                            onClick={handleClaim}
                            disabled={addSubnamePending}
                        >
                            Claim
                        </button>
                    </div>
                    <label className="flex gap-s center">
                        Admin Subdomain:
                        <input type="checkbox" checked={isAdmin} onChange={() => setIsAdmin(!isAdmin)} />
                    </label>

                    {isLoading && <p>Checking availability...</p>}
                    {isAvailable && <p>Subname available</p>}
                </div>
            )}
        </div>
    );
};

export default Home;
