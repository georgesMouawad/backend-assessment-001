import { Route, Routes } from 'react-router-dom';

import Auth from './pages/Auth/Auth';
import Home from './pages/Home/Home';
import Admin from './pages/Admin/Admin';
import GuestRoutes from './components/ProtectedRoutes/GuestRoutes';
import AdminRoutes from './components/ProtectedRoutes/AdminRoutes';
import AuthenticatedRoutes from './components/ProtectedRoutes/AuthenticatedRoutes';

import './App.css';
import './styles/utilities.css';

function App() {
    return (
        <Routes>
            <Route
                path="/auth"
                element={
                    <GuestRoutes>
                        <Auth />
                    </GuestRoutes>
                }
            />
            <Route
                path="/"
                element={
                    <AuthenticatedRoutes>
                        <Home />
                    </AuthenticatedRoutes>
                }
            />
            <Route
                path="/admin"
                element={
                    <AdminRoutes>
                        <Admin />
                    </AdminRoutes>
                }
            />
        </Routes>
    );
}

export default App;
