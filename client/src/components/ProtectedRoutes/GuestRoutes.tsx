import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSiwe } from '../../core/data/SiweProvider';

const GuestRoutes = ({ children }: { children: React.ReactNode }) => {
    const siwe = useSiwe();
    const isAuthenticated = siwe?.isAuthenticated ?? false;
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        } else {
            console.log('User is guest');
        }
    }, [isAuthenticated, navigate]);

    return !isAuthenticated ? <>{children}</> : null;
};

export default GuestRoutes;
