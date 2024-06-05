import React, { useState } from 'react';

import './index.css';

const Home = () => {
    const [username, setUsername] = useState<string>('');
    const handleClaim = () => {
        console.log(username)
        return;
    };

    return (
        <div className="full flex column center">
            <div className="full-width flex column center">
                <h1 className="size-xl">Claim Your ENS Subdomain</h1>
                <div className="full-width flex row center">
                    <input
                        type="text"
                        value={username}
                        className="claim-input"
                        placeholder="Enter a subdomain"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <button className="claim-btn button bold size-l" onClick={handleClaim}>
                        Claim
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
