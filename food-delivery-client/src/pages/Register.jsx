import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
    const location = useLocation();

    // Determine Role based on URL path
    const isVendor = location.pathname.includes('/vendor');
    const isDriver = location.pathname.includes('/driver');
    const currentRole = isVendor ? 'Vendor' : isDriver ? 'Driver' : 'Customer';

    // Dynamic Theme Configuration
    const themeConfig = {
        Customer: {
            text: "text-orange-500",
            bg: "bg-orange-500",
            bgHover: "hover:bg-orange-600",
            ring: "focus:ring-orange-500",
            borderFocus: "focus:border-orange-500",
            shadow: "shadow-orange-200",
            linkHover: "hover:text-orange-600",
            title: "Create an Account",
            subtitle: "Join us to start ordering your favorite meals"
        },
        Vendor: {
            text: "text-teal-600",
            bg: "bg-teal-600",
            bgHover: "hover:bg-teal-700",
            ring: "focus:ring-teal-600",
            borderFocus: "focus:border-teal-600",
            shadow: "shadow-teal-200",
            linkHover: "hover:text-teal-700",
            title: "Become a Partner",
            subtitle: "Grow your restaurant business with us"
        },
        Driver: {
            text: "text-blue-600",
            bg: "bg-blue-600",
            bgHover: "hover:bg-blue-700",
            ring: "focus:ring-blue-600",
            borderFocus: "focus:border-blue-600",
            shadow: "shadow-blue-200",
            linkHover: "hover:text-blue-700",
            title: "Drive with Us",
            subtitle: "Deliver smiles and earn on your schedule"
        }
    };
    const activeTheme = themeConfig[currentRole];

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [status, setStatus] = useState({ type: "", message: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setStatus({ type: 'error', message: 'Passwords do not match.' });
            return;
        }

        setStatus({ type: 'loading', message: 'Creating your account...' });

        try {
            const roleMap = { 'Customer': 0, 'Vendor': 1, 'Driver': 2 };
            const roleInt = roleMap[currentRole];

            const response = await fetch("http://localhost:5121/api/auth/register", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    password: formData.password,
                    role: roleInt
                })
            });

            if (response.ok) {
                setStatus({ type: 'success', message: 'Account created successfully! Redirecting to login...' });
                
                // Redirect to the correct portal login
                const loginPath = currentRole === 'Customer' ? '/login' : `/${currentRole.toLowerCase()}/login`;
                setTimeout(() => { navigate(loginPath, { state: { email: formData.email } }) }, 2000);
            } else {
                setStatus({ type: 'error', message: 'Registration failed. Email might already be in use.' });
            }
        } catch (e) {
            setStatus({ type: 'error', message: 'Network error. Is the .NET API running?' });
        }
    }

    const isLengthValid = formData.password.length >= 6;
    const hasNumber = /\d/.test(formData.password);
    const doPasswordsMatch = formData.confirmPassword.length > 0 && formData.password === formData.confirmPassword;

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
                    <p className="mb-4 text-sm text-center text-slate-500 transition-colors duration-500">{activeTheme.subtitle}</p>

                    {status.message && (
                        <div className={`p-4 mb-6 text-sm font-medium rounded-xl border ${status.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' :
                            status.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' :
                                'bg-blue-50 text-blue-700 border-blue-200'
                            }`}>
                            {status.message}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-3">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                            <input
                                type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                                className={`w-full p-3 border border-slate-200 rounded-xl focus:ring-2 ${activeTheme.ring} ${activeTheme.borderFocus} transition-all duration-500 outline-none bg-slate-50 focus:bg-white`}
                                placeholder="John Doe" required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                            <input
                                type="email" name="email" value={formData.email} onChange={handleChange}
                                className={`w-full p-3 border border-slate-200 rounded-xl focus:ring-2 ${activeTheme.ring} ${activeTheme.borderFocus} transition-all duration-500 outline-none bg-slate-50 focus:bg-white`}
                                placeholder="name@example.com" required
                            />
                        </div>

                        <div className="relative">
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"} name="password" value={formData.password}
                                    onChange={handleChange}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    className={`w-full p-3 pr-10 border border-slate-200 rounded-xl focus:ring-2 ${activeTheme.ring} ${activeTheme.borderFocus} transition-all duration-500 outline-none bg-slate-50 focus:bg-white`}
                                    placeholder="••••••••" required
                                />
                                <button
                                    type="button" onClick={() => setShowPassword(!showPassword)}
                                    className={`absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 ${activeTheme.linkHover} transition-colors duration-500`}
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Dynamic Password Constraints */}
                        {(isFocused || formData.password.length > 0) && (
                            <div className="flex flex-col gap-1.5 mt-2 mb-4 px-1 transition-opacity duration-300">
                                <div className={`flex items-center gap-2 text-xs font-medium transition-colors duration-300 ${isLengthValid ? 'text-green-600' : 'text-red-500'}`}>
                                    {isLengthValid ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                    )}
                                    <span>At least 6 characters</span>
                                </div>
                                <div className={`flex items-center gap-2 text-xs font-medium transition-colors duration-300 ${hasNumber ? 'text-green-600' : 'text-red-500'}`}>
                                    {hasNumber ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                    )}
                                    <span>Contains at least one number</span>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                                    className={`w-full p-3 pr-10 border rounded-xl focus:ring-2 transition-all duration-500 outline-none bg-slate-50 focus:bg-white ${
                                        formData.confirmPassword.length > 0 && !doPasswordsMatch
                                            ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                                            : `border-slate-200 ${activeTheme.borderFocus} ${activeTheme.ring}`
                                    }`}
                                    placeholder="••••••••" required
                                />
                                <button
                                    type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className={`absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 ${activeTheme.linkHover} transition-colors duration-500`}
                                >
                                    {showConfirmPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                                    )}
                                </button>
                            </div>
                            
                            {formData.confirmPassword.length > 0 && (
                                <div className="flex flex-col gap-1.5 mt-2 mb-1 px-1 transition-opacity duration-300">
                                    <div className={`flex items-center gap-2 text-xs font-medium transition-colors duration-300 ${doPasswordsMatch ? 'text-green-600' : 'text-red-500'}`}>
                                        {doPasswordsMatch ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                        )}
                                        <span>Passwords match</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={status.type === 'loading' || !isLengthValid || !hasNumber || !doPasswordsMatch}
                            className={`w-full py-3.5 mt-2 text-white ${activeTheme.bg} rounded-xl ${activeTheme.bgHover} font-bold shadow-lg ${activeTheme.shadow} transition-all duration-500 active:scale-95 disabled:opacity-50 disabled:active:scale-100`}
                        >
                            {status.type === 'loading' ? 'Creating account...' : `Sign Up as ${currentRole}`}
                        </button>
                    </form>
                </div>

                {/* Dynamic Footer with Alternative Portal Links */}
                <div className="py-5 bg-slate-50 border-t border-slate-100 flex flex-col gap-3 text-center transition-colors duration-500">
                    <p className="text-sm text-slate-600">
                        Already have an account?{' '}
                        <Link 
                            to={currentRole === 'Customer' ? '/login' : `/${currentRole.toLowerCase()}/login`} 
                            className={`font-bold ${activeTheme.text} ${activeTheme.linkHover} transition-colors duration-500`}
                        >
                            Sign in
                        </Link>
                    </p>

                    <div className="text-xs text-slate-500 flex items-center justify-center gap-2 flex-wrap px-4 mt-1">
                        {currentRole === 'Customer' && (
                            <>
                                <Link to="/vendor/register" className="hover:text-teal-600 transition-colors">Own a restaurant? Partner with us</Link>
                                <span className="text-slate-300">|</span>
                                <Link to="/driver/register" className="hover:text-blue-600 transition-colors">Want to deliver? Drive with us</Link>
                            </>
                        )}
                        {currentRole === 'Vendor' && (
                            <>
                                <Link to="/register" className="hover:text-orange-500 transition-colors">Looking to order food? Sign up here</Link>
                                <span className="text-slate-300">|</span>
                                <Link to="/driver/register" className="hover:text-blue-600 transition-colors">Want to deliver? Drive with us</Link>
                            </>
                        )}
                        {currentRole === 'Driver' && (
                            <>
                                <Link to="/register" className="hover:text-orange-500 transition-colors">Looking to order food? Sign up here</Link>
                                <span className="text-slate-300">|</span>
                                <Link to="/vendor/register" className="hover:text-teal-600 transition-colors">Own a restaurant? Partner with us</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}