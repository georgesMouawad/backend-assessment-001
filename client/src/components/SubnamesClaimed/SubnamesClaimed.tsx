import { useAccountSubnames, useRevokeSubname } from '@justaname.id/react';

const ensDomain = import.meta.env.VITE_APP_ENS_DOMAIN as string;

import './index.css'

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
            <h3>Claimed Subnames Under {ensDomain}</h3>
            <div className="subnames-container">
                {subnames.map((subname) =>
                    subname.username ? (
                        <span key={subname.id} className="subname-item" onClick={() => handleRevoke(subname.username)}>
                            {subname.subname}
                        </span>
                    ) : null
                )}
            </div>
        </div>
    );
};

export default SubnamesClaimed;
