import './index.css';
import useSubnameClaimLogic from './logic';

const SubnameClaim = () => {
    const {
        isAdmin,
        username,
        isLoading,
        ensDomain,
        setIsAdmin,
        setUsername,
        isAvailable,
        handleClaim,
        debouncedUsername,
    } = useSubnameClaimLogic();

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
