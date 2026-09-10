import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState({ type: "", message: "" });

    const navigate = useNavigate();

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
                setStatus({ type: 'success', message: `Welcome back, ${data.fullName}!` });

                setTimeout(() => { navigate('/home') }, 1000);
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
                // This applies a dark slate gradient directly over a high-quality food image
                backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.85)), url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop')` 
            }}
        >
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 relative z-10">
                <div className="p-8">
                    {/* Branding Header */}
                    <div className="flex justify-center mb-8">
                        <div className="flex items-center gap-2">
                            {/* Lightning Bolt Icon */}
                            <div className="bg-orange-500 p-2 rounded-xl shadow-lg shadow-orange-200">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                                Swift<span className="text-orange-500">Serve</span>
                            </h1>
                        </div>
                    </div>

                    <h2 className="mb-2 text-2xl font-bold text-center text-slate-800">Welcome back</h2>
                    <p className="mb-6 text-sm text-center text-slate-500">Enter your credentials to access your account</p>

                    {/* Status Message Alerts */}
                    {status.message && (
                        <div className={`p-4 mb-6 text-sm font-medium rounded-xl border ${
                            status.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 
                            status.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 
                            'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                            {status.message}
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none bg-slate-50 focus:bg-white"
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none bg-slate-50 focus:bg-white"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status.type === 'loading'}
                            className="w-full py-3.5 mt-4 text-white bg-orange-500 rounded-xl hover:bg-orange-600 font-bold shadow-lg shadow-orange-200 transition-all active:scale-95 disabled:opacity-70"
                        >
                            {status.type === 'loading' ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                </div>

                {/* Bottom Footer Area */}
                <div className="py-5 bg-slate-50 border-t border-slate-100 text-center">
                    <p className="text-sm text-slate-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-bold text-orange-500 hover:text-orange-600 transition-colors">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}