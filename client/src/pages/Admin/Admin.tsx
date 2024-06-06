import React from 'react';
import { useSiwe } from '../../core/data/SiweProvider';
import { Navigate } from 'react-router-dom';


const Admin = () => {
    const siwe = useSiwe();
    const isAuthenticated = siwe?.isAuthenticated ?? false;

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            <h1>Admin Page</h1>
            <p>Welcome, admin!</p>
        </div>
    );
};

export default Admin;
