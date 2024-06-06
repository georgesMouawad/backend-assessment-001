import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSiwe } from '../../core/data/SiweProvider';

const GuestRoutes = ({ children }: { children: React.ReactNode }) => {
    const siwe = useSiwe();
    const isAuthenticated = siwe?.isAuthenticated ?? false;

    const navigate = useNavigate();

    const validate = () => {
        if (isAuthenticated) {
            navigate('/');
        } else {
            console.log('User is Guest');
        }
    };

    useEffect(() => {
        validate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return children;
};

export default GuestRoutes;
