import { useAccountSubnames, useRevokeSubname } from '@justaname.id/react';
import './index.css';

const SubnamesClaimed = () => {
    const { subnames } = useAccountSubnames();
    const { revokeSubname } = useRevokeSubname();

    const handleRevoke = async (username: string) => {
        await revokeSubname({ username });
    };

    const renderSubname = (subname: string) => {
        const parts = subname.split('.');
        return (
            <>
                <strong>{parts[0]}</strong>
                {'.' + parts.slice(1).join('.')}
            </>
        );
    };

    return (
        <div className="claimed">
            {subnames.map((subname) =>
                subname.username ? (
                    <span
                        key={subname.id}
                        className="subname-item border-radius-l border"
                        onClick={() => handleRevoke(subname.username)}
                    >
                        {renderSubname(subname.subname)}
                    </span>
                ) : null
            )}
        </div>
    );
};

export default SubnamesClaimed;
