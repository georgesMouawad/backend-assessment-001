import { useState } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import { useAccountSubnames, useAddSubname, useIsSubnameAvailable, useSubnameSignature } from '@justaname.id/react';
import { requestMethods, sendRequest } from '../../core/tools/apiRequest';

const ensDomain = import.meta.env.VITE_APP_ENS_DOMAIN as string;

import './index.css';

const SubnameClaim = () => {
    const [username, setUsername] = useState<string>('');
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    const { refetchSubnames } = useAccountSubnames();
    const { addSubname } = useAddSubname();
    const { getSignature } = useSubnameSignature();

    const debouncedUsername = useDebounce(username, 750);
    const { isAvailable, isLoading } = useIsSubnameAvailable({
        username: debouncedUsername,
        ensDomain,
    });

    const handleClaim = async () => {
        isAdmin ? await handleAdminClaim() : await addSubname({ username: debouncedUsername });
        await refetchSubnames();
        setUsername('');
        setIsAdmin(false);
    };

    const handleAdminClaim = async () => {
        try {
            const { signature, message, address } = await getSignature();
            await sendRequest(requestMethods.POST, '/justaname/subname', {
                username,
                address,
                signature,
                message,
                isAdmin,
            });
        } catch (error) {
            console.log('Error Claiming Subname: ', error);
        }
    };

    return (
        <>
            <div className="full-width flex column center gap-m">
                <h1>{`Claim Subnames for ${ensDomain}`}</h1>
                <div className="full-width flex row center">
                    <input
                        type="text"
                        value={username}
                        className="claim-input"
                        placeholder="Enter a Subname"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <button
                        className="claim-btn primary-btn button bold size-l flex center"
                        onClick={handleClaim}
                        disabled={!isAvailable || !debouncedUsername}
                    >
                        Claim
                    </button>
                </div>
                <label className="flex gap-s center">
                    Admin Subname:
                    <input type="checkbox" checked={isAdmin} onChange={() => setIsAdmin(!isAdmin)} />
                </label>
            </div>
            <div className="newdomain-info">
                {isLoading ? (
                    <p>Checking availability...</p>
                ) : isAvailable && debouncedUsername ? (
                    <p className="valid">Subname available</p>
                ) : (
                    !isAvailable && debouncedUsername && <p className="error">Subname not available</p>
                )}
            </div>
        </>
    );
};

export default SubnameClaim;
