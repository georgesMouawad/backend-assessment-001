import SubnameClaim from '../../components/SubnameClaim/SubnameClaim';
import SubnamesClaimed from '../../components/SubnamesClaimed/SubnamesClaimed';

import './index.css';
import Links from '../../components/Links/Links';

const Home = () => {
    return (
        <div className="home">
            <Links buttonText="Admin" defaultDestination="/admin" />
            <div className="full flex column center">
                <SubnameClaim />
            </div>
            <SubnamesClaimed />
        </div>
    );
};

export default Home;
