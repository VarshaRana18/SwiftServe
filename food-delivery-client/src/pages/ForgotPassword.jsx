import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function ForgotPassword() {
    const location = useLocation();

    // 1. Determine Role based on URL path
    const isVendor = location.pathname.includes('/vendor');
    const isDriver = location.pathname.includes('/driver');
    const currentRole = isVendor ? 'Vendor' : isDriver ? 'Driver' : 'Customer';

    // 2. Dynamic Theme Configuration (Mirroring Login/Register)
    const themeConfig = {
        Customer: {
            text: "text-orange-500",
            bg: "bg-orange-500",
            bgHover: "hover:bg-orange-600",
            ring: "focus:ring-orange-500",
            borderFocus: "focus:border-orange-500",
            shadow: "shadow-orange-200",
            linkHover: "hover:text-orange-600",
        },
        Vendor: {
            text: "text-teal-600",
            bg: "bg-teal-600",
            bgHover: "hover:bg-teal-700",
            ring: "focus:ring-teal-600",
            borderFocus: "focus:border-teal-600",
            shadow: "shadow-teal-200",
            linkHover: "hover:text-teal-700",
        },
        Driver: {
            text: "text-blue-600",
            bg: "bg-blue-600",
            bgHover: "hover:bg-blue-700",
            ring: "focus:ring-blue-600",
            borderFocus: "focus:border-blue-600",
            shadow: "shadow-blue-200",
            linkHover: "hover:text-blue-700",
        }
    };
    const activeTheme = themeConfig[currentRole];

    const [email, setEmail] = useState("");
    const [status, setStatus] = useState({ type: "", message: "" });

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setStatus({ type: 'loading', message: 'Sending reset link...' });

        try {
            // Note: You will need to ensure this endpoint exists in your C# backend!
            const response = await fetch("http://localhost:5121/api/auth/forgot-password", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                setStatus({ type: 'success', message: 'If that email exists, a reset link has been sent.' });
                setEmail(""); // Clear the input on success
            } else {
                // Security best practice: Don't tell the user if the email exists or not
                setStatus({ type: 'success', message: 'If that email exists, a reset link has been sent.' });
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

                    <h2 className="mb-2 text-2xl font-bold text-center text-slate-800 transition-colors duration-500">Reset Password</h2>
                    <p className="mb-6 text-sm text-center text-slate-500 transition-colors duration-500">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>

                    {status.message && (
                        <div className={`p-4 mb-6 text-sm font-medium rounded-xl border ${status.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' :
                            status.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' :
                                'bg-blue-50 text-blue-700 border-blue-200'
                            }`}>
                            {status.message}
                        </div>
                    )}

                    <form onSubmit={handleResetPassword} className="space-y-4">
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

                        <button
                            type="submit"
                            disabled={status.type === 'loading' || !email}
                            className={`w-full py-3.5 mt-2 text-white ${activeTheme.bg} rounded-xl ${activeTheme.bgHover} font-bold shadow-lg ${activeTheme.shadow} transition-all duration-500 active:scale-95 disabled:opacity-70`}
                        >
                            {status.type === 'loading' ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                </div>

                <div className="py-5 bg-slate-50 border-t border-slate-100 flex flex-col gap-3 text-center transition-colors duration-500">
                    <p className="text-sm text-slate-600">
                        Remember your password?{' '}
                        <Link 
                            to={currentRole === 'Customer' ? '/login' : `/${currentRole.toLowerCase()}/login`} 
                            className={`font-bold ${activeTheme.text} ${activeTheme.linkHover} transition-colors duration-500`}
                        >
                            Back to Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}