import { useSiwe } from '../../core/data/SiweProvider';

const Auth = () => {
    const siwe = useSiwe();
    const signIn = siwe?.signIn;

    return (
        <div className="full flex column center">
          <h1 className='size-xl'>Welcome to JustaName Integration</h1>
          <h1 className='size-l'>Sign in With Ethereum</h1>
            <button onClick={signIn} className="primary-btn btn-l border-radius">
                Sign in
            </button>
        </div>
    );
};

export default Auth;
