import Links from '../../components/Links/Links';

import './index.css'

const Admin = () => {
    return (
        <div className='admin'>
            <Links defaultDestination="/" buttonText="Home" />
            <div className="full flex column center">
                <h1>Admin Page</h1>
                <p>Welcome!</p>
            </div>
        </div>
    );
};

export default Admin;
