import React, { useState } from 'react';
import { requestMethods, sendRequest } from '../../core/tools/apiRequest';

import './index.css';

const Home = () => {
    const [username, setUsername] = useState<string>('');
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    const handleClaim = async () => {
        console.log(username, isAdmin);

        try {
            const response = await sendRequest(requestMethods.POST, '/justaname/subdomain', { username });
            console.log(response.data);
            setUsername('');
            setIsAdmin(false);
        } catch (error) {
            console.log('Error Claiming Subdomain: ', error);
        }
    };

    return (
        <div className="full flex column center">
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
                    <button className="claim-btn button bold size-l" onClick={handleClaim}>
                        Claim
                    </button>
                </div>
                <label className="flex gap-s center">
                    Admin Subdomain:
                    <input type="checkbox" checked={isAdmin} onChange={() => setIsAdmin(!isAdmin)} />
                </label>
            </div>
        </div>
    );
};

export default Home;
