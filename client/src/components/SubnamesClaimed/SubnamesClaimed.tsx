import { useAccountSubnames, useRevokeSubname } from '@justaname.id/react';

// const ensDomain = import.meta.env.VITE_APP_ENS_DOMAIN as string;

import './index.css';

const SubnamesClaimed = () => {
    const { subnames, refetchSubnames } = useAccountSubnames();
    const { revokeSubname } = useRevokeSubname();
    console.log(subnames);
    const handleRevoke = async (username: string) => {
        await revokeSubname({ username });
        await refetchSubnames();
    };

    return (
        <div className="claimed">
            {subnames.map((subname) =>
                subname.username ? (
                    <span key={subname.id} className="subname-item" onClick={() => handleRevoke(subname.username)}>
                        {subname.subname}
                    </span>
                ) : null
            )}
        </div>
    );
};

export default SubnamesClaimed;
