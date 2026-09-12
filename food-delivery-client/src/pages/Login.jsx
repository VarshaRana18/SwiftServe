import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    // 1. Determine Role based on URL path
    const isVendor = location.pathname.includes('/vendor');
    const isDriver = location.pathname.includes('/driver');
    const currentRole = isVendor ? 'Vendor' : isDriver ? 'Driver' : 'Customer';

    // 2. Dynamic Theme Configuration
    const themeConfig = {
        Customer: {
            text: "text-orange-500",
            bg: "bg-orange-500",
            bgHover: "hover:bg-orange-600",
            ring: "focus:ring-orange-500",
            borderFocus: "focus:border-orange-500",
            shadow: "shadow-orange-200",
            linkHover: "hover:text-orange-600",
            checkbox: "text-orange-500 focus:ring-orange-500",
            title: "Welcome Back",
            subtitle: "Enter your credentials to access your account"
        },
        Vendor: {
            text: "text-teal-600",
            bg: "bg-teal-600",
            bgHover: "hover:bg-teal-700",
            ring: "focus:ring-teal-600",
            borderFocus: "focus:border-teal-600",
            shadow: "shadow-teal-200",
            linkHover: "hover:text-teal-700",
            checkbox: "text-teal-600 focus:ring-teal-600",
            title: "Partner Login",
            subtitle: "Manage your restaurant and incoming orders"
        },
        Driver: {
            text: "text-blue-600",
            bg: "bg-blue-600",
            bgHover: "hover:bg-blue-700",
            ring: "focus:ring-blue-600",
            borderFocus: "focus:border-blue-600",
            shadow: "shadow-blue-200",
            linkHover: "hover:text-blue-700",
            checkbox: "text-blue-600 focus:ring-blue-600",
            title: "Driver Dashboard",
            subtitle: "Sign in to start receiving delivery requests"
        }
    };
    const activeTheme = themeConfig[currentRole];

    // 3. Pre-fill logic: Check if React Router passed an email via state
    const [email, setEmail] = useState(location.state?.email || "");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    
    const [status, setStatus] = useState({ type: "", message: "" });
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setStatus({ type: 'loading', message: 'Logging in...' });

        try {
            const response = await fetch("http://localhost:5121/api/auth/login", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role);
                // In a real app, you would also securely store a refresh token here if rememberMe is true
                
                setStatus({ type: 'success', message: `Welcome back, ${data.fullName}!` });
                
                // Route to the appropriate dashboard based on role
                const homePath = currentRole === 'Vendor' ? '/vendor/dashboard' : currentRole === 'Driver' ? '/driver/dashboard' : '/home';
                setTimeout(() => { navigate(homePath) }, 1000);
            } else {
                setStatus({ type: 'error', message: 'Invalid email or password.' });
            }
        } catch (e) {
            setStatus({ type: 'error', message: 'Network error. Is the .NET API running?' });
        }
    }

    return (
        <div
            className="flex items-center justify-center min-h-screen p-4 bg-cover bg-center bg-no-repeat relative"
            style={{
                backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.85)), url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop')`
            }}
        >
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 relative z-10 my-4 sm:my-auto">
                <div className="px-8 py-6">
                    {/* Branding Header */}
                    <div className="flex justify-center mb-4">
                        <div className="flex items-center gap-2">
                            <div className={`${activeTheme.bg} p-2 rounded-xl shadow-lg transition-colors duration-500 ${activeTheme.shadow}`}>
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight transition-colors duration-500">
                                Swift<span className={activeTheme.text}>Serve</span>
                            </h1>
                        </div>
                    </div>

                    <h2 className="mb-2 text-2xl font-bold text-center text-slate-800 transition-colors duration-500">{activeTheme.title}</h2>
                    <p className="mb-6 text-sm text-center text-slate-500 transition-colors duration-500">{activeTheme.subtitle}</p>

                    {status.message && (
                        <div className={`p-4 mb-6 text-sm font-medium rounded-xl border ${status.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' :
                                status.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' :
                                    'bg-blue-50 text-blue-700 border-blue-200'
                            }`}>
                            {status.message}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full p-3 border border-slate-200 rounded-xl focus:ring-2 ${activeTheme.ring} ${activeTheme.borderFocus} transition-all duration-500 outline-none bg-slate-50 focus:bg-white`}
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full p-3 pr-10 border border-slate-200 rounded-xl focus:ring-2 ${activeTheme.ring} ${activeTheme.borderFocus} transition-all duration-500 outline-none bg-slate-50 focus:bg-white`}
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    title="Show Password"
                                    className={`absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 ${activeTheme.linkHover} transition-colors duration-500`}
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Polish: Remember Me & Forgot Password Row */}
                        <div className="flex items-center justify-between mt-1">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={rememberMe}
                                    onChange={() => setRememberMe(!rememberMe)}
                                    className={`w-4 h-4 rounded border-slate-300 ${activeTheme.checkbox} transition-colors cursor-pointer`} 
                                />
                                <span className="text-sm text-slate-600 font-medium select-none">Remember me</span>
                            </label>
                            <Link 
                                to={currentRole === 'Customer' ? '/forgot-password' : `/${currentRole.toLowerCase()}/forgot-password`} 
                                className={`text-sm font-semibold ${activeTheme.text} ${activeTheme.linkHover} transition-colors duration-500`}
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Explicit Button Text to prevent wrong-portal logins */}
                        <button
                            type="submit"
                            disabled={status.type === 'loading'}
                            className={`w-full py-3.5 mt-2 text-white ${activeTheme.bg} rounded-xl ${activeTheme.bgHover} font-bold shadow-lg ${activeTheme.shadow} transition-all duration-500 active:scale-95 disabled:opacity-70`}
                        >
                            {status.type === 'loading' ? 'Signing in...' : `Sign In as ${currentRole}`}
                        </button>
                    </form>
                </div>

                {/* Dynamic Footer syncing with Register.jsx logic */}
                <div className="py-5 bg-slate-50 border-t border-slate-100 flex flex-col gap-3 text-center transition-colors duration-500">
                    <p className="text-sm text-slate-600">
                        Don't have an account?{' '}
                        <Link 
                            to={currentRole === 'Customer' ? '/register' : `/${currentRole.toLowerCase()}/register`} 
                            className={`font-bold ${activeTheme.text} ${activeTheme.linkHover} transition-colors duration-500`}
                        >
                            Sign up
                        </Link>
                    </p>

                    <div className="text-xs text-slate-500 flex items-center justify-center gap-2 flex-wrap px-4 mt-1">
                        {currentRole === 'Customer' && (
                            <>
                                <Link to="/vendor/login" className="hover:text-teal-600 transition-colors">Partner Login</Link>
                                <span className="text-slate-300">|</span>
                                <Link to="/driver/login" className="hover:text-blue-600 transition-colors">Driver Login</Link>
                            </>
                        )}
                        {currentRole === 'Vendor' && (
                            <>
                                <Link to="/login" className="hover:text-orange-500 transition-colors">Customer Login</Link>
                                <span className="text-slate-300">|</span>
                                <Link to="/driver/login" className="hover:text-blue-600 transition-colors">Driver Login</Link>
                            </>
                        )}
                        {currentRole === 'Driver' && (
                            <>
                                <Link to="/login" className="hover:text-orange-500 transition-colors">Customer Login</Link>
                                <span className="text-slate-300">|</span>
                                <Link to="/vendor/login" className="hover:text-teal-600 transition-colors">Partner Login</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}