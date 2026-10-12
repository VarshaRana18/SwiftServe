import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import CustomerHome from './pages/CustomerHome';
import VendorDashboard from './pages/VendorDashboard';
import DriverDashboard from "./pages/DriverDashboard";

// ==========================================
// AUTHENTICATION & AUTHORIZATION GUARDS
// ==========================================

// Helper: Checks if token exists and is not expired
const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const payload = JSON.parse(jsonPayload);
        
        // Check if token is expired (exp is in seconds, Date.now() is in ms)
        if (payload.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            localStorage.removeItem('roles');
            return null;
        }

        const roles = JSON.parse(localStorage.getItem('roles') || '[]');
        return roles;
    } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('roles');
        return null;
    }
};

// Guard: Prevents logged-in users from seeing Login/Register pages
const RequireGuest = ({ children }) => {
    const roles = checkAuth();
    
    if (roles) {
        if (roles.includes('Customer')) return <Navigate to="/home" replace />;
        if (roles.includes('Vendor')) return <Navigate to="/vendor/dashboard" replace />;
        if (roles.includes('Driver')) return <Navigate to="/driver/dashboard" replace />;
    }
    
    return children;
};

// Guard: Prevents unauthorized users from seeing specific dashboards
const RequireRole = ({ children, requiredRole }) => {
    const roles = checkAuth();

    // 1. Not logged in at all
    if (!roles) {
        const loginPath = requiredRole === 'Customer' ? '/login' : `/${requiredRole.toLowerCase()}/login`;
        return <Navigate to={loginPath} replace />;
    }

    // 2. Logged in, but missing the specific required role
    if (!roles.includes(requiredRole)) {
        if (roles.includes('Customer')) return <Navigate to="/home" replace />;
        if (roles.includes('Vendor')) return <Navigate to="/vendor/dashboard" replace />;
        if (roles.includes('Driver')) return <Navigate to="/driver/dashboard" replace />;
    }

    // 3. Authorized!
    return children;
};

// Dynamic Root Redirector
const RootRedirect = () => {
    const roles = checkAuth();
    if (!roles) return <Navigate to="/login" replace />;
    if (roles.includes('Customer')) return <Navigate to="/home" replace />;
    if (roles.includes('Vendor')) return <Navigate to="/vendor/dashboard" replace />;
    if (roles.includes('Driver')) return <Navigate to="/driver/dashboard" replace />;
    return <Navigate to="/login" replace />;
};

// ==========================================
// MAIN APP ROUTER
// ==========================================

function App() {
    return (
        <Router>
            <Routes>
                {/* Dynamic Default Route */}
                <Route path="/" element={<RootRedirect />} />

                {/* --- CUSTOMER PORTAL --- */}
                <Route path="/home" element={<RequireRole requiredRole="Customer"><CustomerHome /></RequireRole>} />
                <Route path="/register" element={<RequireGuest><Register /></RequireGuest>} />
                <Route path="/login" element={<RequireGuest><Login /></RequireGuest>} />
                <Route path="/forgot-password" element={<RequireGuest><ForgotPassword /></RequireGuest>} />

                {/* --- VENDOR PORTAL --- */}
                <Route path="/vendor/dashboard" element={<RequireRole requiredRole="Vendor"><VendorDashboard /></RequireRole>} />
                <Route path="/vendor/register" element={<RequireGuest><Register /></RequireGuest>} />
                <Route path="/vendor/login" element={<RequireGuest><Login /></RequireGuest>} />
                <Route path="/vendor/forgot-password" element={<RequireGuest><ForgotPassword /></RequireGuest>} />

                {/* --- DRIVER PORTAL --- */}
                <Route path="/driver/dashboard" element={<RequireRole requiredRole="Driver"><DriverDashboard /></RequireRole>} />
                <Route path="/driver/register" element={<RequireGuest><Register /></RequireGuest>} />
                <Route path="/driver/login" element={<RequireGuest><Login /></RequireGuest>} />
                <Route path="/driver/forgot-password" element={<RequireGuest><ForgotPassword /></RequireGuest>} />

                {/* Fallback Route for 404s */}
                <Route path="*" element={<RootRedirect />} />
            </Routes>
        </Router>
    );
}

export default App;