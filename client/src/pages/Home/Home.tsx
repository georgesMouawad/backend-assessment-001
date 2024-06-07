import { useSiwe } from '../../core/data/SiweProvider';
import SubnameClaim from '../../components/SubnameClaim/SubnameClaim';
import SubnamesClaimed from '../../components/SubnamesClaimed/SubnamesClaimed';

import Links from '../../components/Links/Links';

import './index.css';

const Home = () => {
    const siwe = useSiwe();
    const isAdminAvailable = siwe?.isAdminSubnameAvailable ?? false;
    return (
        <div className="home">
            {isAdminAvailable && <Links buttonText="Admin" defaultDestination="/admin" />}
            <div className="full flex column center">
                <SubnameClaim />
            </div>
            <SubnamesClaimed />
        </div>
    );
};

export default Home;
