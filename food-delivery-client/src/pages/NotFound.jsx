import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate();
    const location = useLocation(); // NEW: Hook to read the current broken URL

    const [theme, setTheme] = useState({
        bg: "bg-slate-800",
        hover: "hover:bg-slate-900",
        text: "Return to Login",
        path: "/login",
        shadow: "shadow-slate-200"
    });

    useEffect(() => {
        try {
            const token = localStorage.getItem('token');
            const roles = JSON.parse(localStorage.getItem('roles') || '[]');

            if (token && roles.length > 0) {
                // 1. Determine which section of the app they are lost in
                const isVendorContext = location.pathname.includes('/vendor');
                const isDriverContext = location.pathname.includes('/driver');

                // 2. Check Context + Role Match first
                if (isVendorContext && roles.includes('Vendor')) {
                    setTheme({
                        bg: "bg-teal-600", hover: "hover:bg-teal-700", 
                        text: "Back to Kitchen", path: "/vendor/dashboard", shadow: "shadow-teal-200"
                    });
                } 
                else if (isDriverContext && roles.includes('Driver')) {
                    setTheme({
                        bg: "bg-blue-600", hover: "hover:bg-blue-700", 
                        text: "Back to the Road", path: "/driver/dashboard", shadow: "shadow-blue-200"
                    });
                } 
                // 3. Fallbacks (If they aren't in a specific context, or are in one they don't own)
                else if (roles.includes('Customer')) {
                    setTheme({
                        bg: "bg-orange-500", hover: "hover:bg-orange-600", 
                        text: "Back to Menu", path: "/home", shadow: "shadow-orange-200"
                    });
                } 
                else if (roles.includes('Vendor')) {
                    setTheme({
                        bg: "bg-teal-600", hover: "hover:bg-teal-700", 
                        text: "Back to Kitchen", path: "/vendor/dashboard", shadow: "shadow-teal-200"
                    });
                }
                else if (roles.includes('Driver')) {
                    setTheme({
                        bg: "bg-blue-600", hover: "hover:bg-blue-700", 
                        text: "Back to the Road", path: "/driver/dashboard", shadow: "shadow-blue-200"
                    });
                }
            }
        } catch (e) {
            console.error("Failed to parse roles for 404 routing");
        }
    }, [location.pathname]); // Re-run if the path changes

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                <div className="relative w-48 h-48 mx-auto mb-8">
                    <div className="absolute inset-0 bg-slate-200 rounded-full shadow-inner animate-pulse"></div>
                    <svg className="absolute inset-0 w-full h-full text-slate-300 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-5.5a2.5 2.5 0 015 0" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M16 10h.01M12 14c-1.5 0-2 .5-2 .5s.5.5 2 .5 2-.5 2-.5-.5-.5-2-.5z" />
                    </svg>
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-slate-300 rounded-full"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-slate-300 rounded-full"></div>
                    <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                </div>

                <h1 className="text-6xl font-extrabold text-slate-800 tracking-tight mb-2">404</h1>
                <h2 className="text-2xl font-bold text-slate-700 mb-4">Looks like someone ate this page.</h2>
                <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                    We searched everywhere, but the link you followed is broken, missing, or was taken off the menu.
                </p>

                <div className="flex items-center justify-center gap-4">
                    {/* NEW: Go Back Button */}
                    <button 
                        onClick={() => navigate(-1)}
                        className="px-8 py-4 text-slate-600 bg-white border-2 border-slate-200 font-bold rounded-xl transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
                    >
                        Go Back
                    </button>

                    {/* EXISTING: Dynamic Context Button */}
                    <button 
                        onClick={() => navigate(theme.path)}
                        className={`inline-flex items-center justify-center gap-2 px-8 py-4 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95 ${theme.bg} ${theme.hover} ${theme.shadow}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        {theme.text}
                    </button>
                </div>
            </div>
        </div>
    );
}