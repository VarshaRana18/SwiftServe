import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import CustomerHome from './pages/CustomerHome';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Route - Redirects to Customer Home or Login depending on your flow */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Customer Home Page */}
        <Route path="/home" element={<CustomerHome />} />

        {/* --- CUSTOMER PORTAL --- */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* --- VENDOR PORTAL --- */}
        <Route path="/vendor/register" element={<Register />} />
        <Route path="/vendor/login" element={<Login />} />
        <Route path="/vendor/forgot-password" element={<ForgotPassword />} />

        {/* --- DRIVER PORTAL --- */}
        <Route path="/driver/register" element={<Register />} />
        <Route path="/driver/login" element={<Login />} />
        <Route path="/driver/forgot-password" element={<ForgotPassword />} />
        
        {/* Fallback Route for 404s */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;