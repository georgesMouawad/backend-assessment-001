import SubnameClaim from '../../components/SubnameClaim/SubnameClaim';
import SubnamesClaimed from '../../components/SubnamesClaimed/SubnamesClaimed';

import './index.css';

const Home = () => {
    return (
        <div className="home full">
            <div className="full flex column center">
                <SubnameClaim />
            </div>
            <SubnamesClaimed />
        </div>
    );
};

export default Home;
