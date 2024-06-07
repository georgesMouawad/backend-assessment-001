import { useNavigate } from 'react-router-dom';

import './index.css'

const Links: React.FC<{ defaultDestination: string; buttonText: string }> = ({ defaultDestination, buttonText }) => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(defaultDestination);
    };

    return (
        <div className="links size-xl">
            <span onClick={handleClick}>{buttonText}</span>
        </div>
    );
};

export default Links;
