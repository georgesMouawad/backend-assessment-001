import { useSiwe } from '../../core/data/SiweProvider';
import './index.css';

const Auth = () => {
    const siwe = useSiwe();
    const signIn = siwe?.signIn;

    return (
        <div className="auth full flex column center">
            {/* {!address ? (
                <ConnectButton label="Connet Your Wallet" />
            ) : (
                <button onClick={signIn} className="primary-btn btn-l border-radius-l">
                    Login
                </button>
            )} */}
            <button onClick={signIn} className="primary-btn btn-l border-radius-l">
                Login
            </button>
        </div>
    );
};

export default Auth;
