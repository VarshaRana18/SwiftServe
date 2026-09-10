import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState({ type: "", message: "" });
    const [showPassword, setShowPassword] = useState(false);

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
                        <div className={`p-4 mb-6 text-sm font-medium rounded-xl border ${status.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' :
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
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    // Added pr-10 to give space for the icon on the right
                                    className="w-full p-3 pr-10 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none bg-slate-50 focus:bg-white"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    title="Show Password"
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-orange-500 transition-colors"
                                >
                                    {showPassword ? (
                                        // Eye Open Icon
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    ) : (
                                        // Eye Closed Icon (Slash)
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    )}
                                </button>
                            </div>

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

