import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSiwe } from '../../core/data/SiweProvider';

const AuthenticatedRoutes = ({ children }: { children: React.ReactNode }) => {
    const siwe = useSiwe();
    const isAuthenticated = siwe?.isAuthenticated ?? false;
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth');
        } else {
            console.log('User is logged in');
        }
    }, [isAuthenticated, navigate]);

    return isAuthenticated ? <>{children}</> : null;
};

export default AuthenticatedRoutes;
