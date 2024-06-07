import { useState } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import { useAccountSubnames, useAddSubname, useIsSubnameAvailable, useSubnameSignature } from '@justaname.id/react';
import { requestMethods, sendRequest } from '../../core/tools/apiRequest';

const ensDomain = import.meta.env.VITE_APP_ENS_DOMAIN as string;

const useSubnameClaimLogic = () => {
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

    return {
        ensDomain, username, setUsername, handleClaim, isAvailable, isAdmin, setIsAdmin, debouncedUsername, isLoading
    }

}

export default useSubnameClaimLogic