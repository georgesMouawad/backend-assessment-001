import { useEffect, useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { useDebounce } from '@uidotdev/usehooks';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccountSubnames, useAddSubname, useIsSubnameAvailable, useRevokeSubname } from '@justaname.id/react';
import { AddSubnameRequest } from '../../interfaces/AddSubnameRequest';
import { requestMethods, sendRequest } from '../../core/tools/apiRequest';

import './index.css';

const ensDomain = import.meta.env.VITE_APP_ENS_DOMAIN as string;

const Home = () => {
    const [username, setUsername] = useState<string>('');
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [signature, setSignature] = useState<string>('');
    const [message, setMessage] = useState<string>('');


    const { address } = useAccount();
    const { data: signMessageData, signMessage } = useSignMessage();

    const { subnames, refetchSubnames } = useAccountSubnames();
    const { revokeSubname } = useRevokeSubname();
    const { addSubname } = useAddSubname<AddSubnameRequest>();
    const debouncedUsername = useDebounce(username, 500);
    const { isAvailable, isLoading } = useIsSubnameAvailable({
        username: debouncedUsername,
        ensDomain,
    });


    useEffect(() => {
        if (signMessageData) {
            setSignature(signMessageData);
        }
    }, [signMessageData]);

    console.log(subnames);

    // const createSiweMessage = (address: string, statement: string) => {
    //     const siweMessage = new SiweMessage({
    //         domain: 'localhost:5173',
    //         address,
    //         statement,
    //         uri: 'http://localhost:5173',
    //         version: '1',
    //         chainId: 11155111,
    //     });

    //     return siweMessage.prepareMessage();
    // };

    const handleRevoke = async (username: string) => {
        await revokeSubname({ username });
        await refetchSubnames();
    };

    const handleAdminSubname = async () => {
        if (!isAdmin || !address) return;
        try {
            const challengeResponse = await sendRequest(
                requestMethods.GET,
                `/justaname/requestchallenge?address=${address}`
            );
            console.log(challengeResponse.data.challenge);
            const statement = challengeResponse.data.challenge;
            signMessage({ message: statement });
            setMessage(statement);
        } catch (error) {
            console.log(error);
        }
    };

    const handleAdminClaim = async () => {
        if (!address || !signature || !message) return;

        try {
            const response = await sendRequest(requestMethods.POST, '/justaname/subdomain', {
                username,
                address,
                signature,
                message,
                isAdmin,
            });
            console.log(response.data);
            setUsername('');
            setIsAdmin(false);
        } catch (error) {
            console.log('Error Claiming Subdomain: ', error);
        }
    };

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
                                onClick={() => handleRevoke(subname.username)}
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
                                    onClick={() => {
                                        console.log('Sending add sub', username, isAdmin);
                                        // addSubname({ username, isAdmin });
                                        signature ? handleAdminClaim() : handleAdminSubname();
                                    }}
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
