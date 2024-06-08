import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSiwe } from '../../core/data/SiweProvider';

const AdminRoutes = ({ children }: { children: React.ReactNode }) => {
    const siwe = useSiwe();
    const isAdminAvailable = siwe?.isAdminSubnameAvailable ?? false;
    const isAuthenticated = siwe?.isAuthenticated ?? false;
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated || !isAdminAvailable) {
            navigate('/');
        } else {
            console.log('User has admin subnames');
        }
    }, [isAuthenticated, isAdminAvailable, navigate]);

    return isAuthenticated && isAdminAvailable ? <>{children}</> : null;
};

export default AdminRoutes;
