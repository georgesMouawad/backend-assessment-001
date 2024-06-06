import { Route, Routes } from 'react-router-dom';

import Auth from './pages/Auth/Auth';
import Home from './pages/Home/Home';
import Admin from './pages/Admin/Admin';
import GuestRoutes from './components/ProtectedRoutes/GuestRoutes';
import AuthenticatedRoutes from './components/ProtectedRoutes/AuthenticatedRoutes';

import './App.css';
import './styles/utilities.css';

function App() {
    return (
        <>
            <GuestRoutes>
                <Routes>
                    <Route path="/auth" element={<Auth />} />
                </Routes>
            </GuestRoutes>
            <AuthenticatedRoutes>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/admin" element={<Admin />} />
                </Routes>
            </AuthenticatedRoutes>
        </>
    );
}

export default App;
