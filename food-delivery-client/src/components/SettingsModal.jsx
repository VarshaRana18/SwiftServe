import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function SettingsModal() {
    const { isSettingsOpen, setIsSettingsOpen, isVegOnly, setIsVegOnly, setSelectedAddressId, setActiveLocation } = useCart();

    // Real User State
    const [realUser, setRealUser] = useState({ name: "Loading...", email: "Loading...", phone: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
    
    // Validation state for the edit form
    const [validationError, setValidationError] = useState("");

    // Role Upgrade States
    const [upgradeIntent, setUpgradeIntent] = useState(null); // 'Vendor', 'Driver', or null
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [upgradeError, setUpgradeError] = useState("");
    const [userRoles, setUserRoles] = useState(['Customer']);
    
    const navigate = useNavigate();

    // Decode the JWT whenever the modal opens
    useEffect(() => {
        if (isSettingsOpen) {
            const token = localStorage.getItem('token');
            const roles = JSON.parse(localStorage.getItem('roles') || '["Customer"]');
            setUserRoles(roles);
            
            if (token) {
                try {
                    const base64Url = token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join(''));
                    
                    const payload = JSON.parse(jsonPayload);
                    const emailClaim = payload.email || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || "No Email";
                    const nameClaim = payload.fullName || payload.name || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "Customer";
                    const phoneCache = localStorage.getItem('customerPhone') || "";
                    
                    setRealUser({ name: nameClaim, email: emailClaim, phone: phoneCache });
                    setFormData({ name: nameClaim, email: emailClaim, phone: phoneCache });
                } catch (e) {
                    console.error("Failed to decode user token.");
                    setRealUser({ name: "Error", email: "Error", phone: "" });
                }
            }
        } else {
            // Reset intent when modal closes
            setUpgradeIntent(null);
            setUpgradeError("");
            setIsEditing(false);
            setValidationError("");
        }
    }, [isSettingsOpen]);

    if (!isSettingsOpen) return null;

    // UNIFIED PROFILE UPDATE API WITH STRICT VALIDATION
    const handleSave = async () => {
        setValidationError(""); // Reset error state

        // 1. Basic Name Validation
        if (!formData.name.trim()) {
            setValidationError("Full Name cannot be empty.");
            return;
        }

        // 2. Email Regex Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setValidationError("Please enter a valid email address.");
            return;
        }

        // 3. Strict Phone Validation (10-digits only)
        // Strip out everything except numbers
        let justDigits = formData.phone.replace(/\D/g, '');
        
        // If they included the '91' country code (making it 12 digits), strip it for the check
        if (justDigits.length === 12 && justDigits.startsWith('91')) {
            justDigits = justDigits.substring(2);
        }

        if (justDigits.length !== 10) {
            setValidationError("Please enter exactly a 10-digit contact number.");
            return;
        }

        setIsSavingProfile(true);
        const token = localStorage.getItem('token');
        
        try {
            const response = await fetch("http://localhost:5121/api/auth/profile", {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    fullName: formData.name,
                    email: formData.email,
                    phoneNumber: formData.phone
                })
            });
            
            if (response.ok) {
                setRealUser(formData);
                setIsEditing(false);
                localStorage.setItem('customerPhone', formData.phone);
            } else {
                setValidationError("Failed to update profile details on the server.");
            }
        } catch (error) {
            console.error("Profile update error:", error);
            setValidationError("Network error. Please try again.");
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleRoleUpgrade = async (newRole) => {
        setIsUpgrading(true);
        setUpgradeError("");
        const currentToken = localStorage.getItem('token');
        
        try {
            const response = await fetch("http://localhost:5121/api/auth/upgrade-role", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentToken}`
                },
                body: JSON.stringify({ newRole })
            });
            
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('roles', JSON.stringify(data.roles));
                setIsSettingsOpen(false);
                if (newRole === 'Vendor') navigate('/vendor/dashboard');
                if (newRole === 'Driver') navigate('/driver/dashboard');
            } else {
                setUpgradeError(`Failed to upgrade to ${newRole}.`);
            }
        } catch (error) {
            setUpgradeError("Network error. Could not reach server.");
        } finally {
            setIsUpgrading(false);
        }
    };

    const handleLogout = () => {
        setSelectedAddressId(null);
        setActiveLocation("Select Location");
        localStorage.removeItem('token');
        localStorage.removeItem('roles');
        localStorage.removeItem('customerPhone');
        setIsSettingsOpen(false);
        navigate("/login");
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsSettingsOpen(false)}></div>
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
                
                {/* OVERLAY: VALUE-PROP CONFIRMATION MODAL */}
                {upgradeIntent && (
                    <div className="absolute inset-0 bg-white z-50 flex flex-col p-6 animate-slide-in-right">
                        <button onClick={() => setUpgradeIntent(null)} disabled={isUpgrading} className="absolute top-6 left-6 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <div className="flex-1 flex flex-col items-center justify-center text-center mt-8">
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${upgradeIntent === 'Vendor' ? 'bg-teal-100 text-teal-600' : 'bg-blue-100 text-blue-600'}`}>
                                {upgradeIntent === 'Vendor' ? (
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                ) : (
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                                )}
                            </div>
                            <h2 className="text-2xl font-extrabold text-slate-800 mb-2">{upgradeIntent === 'Vendor' ? "Ready to grow your business?" : "Ready to hit the road?"}</h2>
                            <p className="text-slate-500 font-medium mb-8">{upgradeIntent === 'Vendor' ? "Upgrade to a Partner account to unlock your dedicated kitchen display, menu manager, and live order tracking." : "Upgrade to a Driver account to start delivering orders and earning payouts today."}</p>
                            {upgradeError && <p className="text-sm text-red-500 font-bold mb-4">{upgradeError}</p>}
                            <button onClick={() => handleRoleUpgrade(upgradeIntent)} disabled={isUpgrading} className={`w-full text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2 ${upgradeIntent === 'Vendor' ? 'bg-teal-600 hover:bg-teal-700 shadow-teal-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}>
                                {isUpgrading ? (
                                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Upgrading Account...</>
                                ) : "Confirm & Access Dashboard"}
                            </button>
                        </div>
                    </div>
                )}

                {/* STANDARD SETTINGS UI */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800">Settings</h2>
                    <button onClick={() => setIsSettingsOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-6 space-y-8 max-h-[80vh] overflow-y-auto">
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Account Details</h3>
                            {!isEditing ? (
                                <button onClick={() => setIsEditing(true)} className="text-sm font-bold text-orange-500 hover:text-orange-600">Edit</button>
                            ) : (
                                <div className="flex gap-3">
                                    <button onClick={() => { setIsEditing(false); setValidationError(""); setFormData(realUser); }} className="text-sm font-bold text-slate-400 hover:text-slate-600 disabled:opacity-50">Cancel</button>
                                    <button onClick={handleSave} disabled={isSavingProfile} className="text-sm font-bold text-green-500 hover:text-green-600 disabled:opacity-50">{isSavingProfile ? "Saving..." : "Save"}</button>
                                </div>
                            )}
                        </div>
                        
                        {/* VALIDATION ERROR DISPLAY */}
                        {validationError && isEditing && (
                            <div className="bg-red-50 text-red-600 text-xs font-bold px-3 py-2 rounded-lg mb-4 flex items-center gap-2">
                                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {validationError}
                            </div>
                        )}
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Full Name</label>
                                <input type="text" value={isEditing ? formData.name : realUser.name} onChange={(e) => { setFormData({...formData, name: e.target.value}); setValidationError(""); }} disabled={!isEditing} className={`w-full font-bold text-slate-800 rounded-xl px-4 py-3 transition-colors ${isEditing ? 'bg-white border-2 border-orange-500 focus:outline-none' : 'bg-slate-50 border border-slate-100'}`} />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Email Address</label>
                                <input type="email" value={isEditing ? formData.email : realUser.email} onChange={(e) => { setFormData({...formData, email: e.target.value}); setValidationError(""); }} disabled={!isEditing} className={`w-full font-bold text-slate-800 rounded-xl px-4 py-3 transition-colors ${isEditing ? 'bg-white border-2 border-orange-500 focus:outline-none' : 'bg-slate-50 border border-slate-100'}`} />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Contact Number</label>
                                <input type="tel" value={isEditing ? formData.phone : (realUser.phone || "Not provided")} onChange={(e) => { setFormData({...formData, phone: e.target.value}); setValidationError(""); }} disabled={!isEditing} className={`w-full font-bold text-slate-800 rounded-xl px-4 py-3 transition-colors ${isEditing ? 'bg-white border-2 border-orange-500 focus:outline-none' : 'bg-slate-50 border border-slate-100'}`} />
                            </div>
                        </div>
                    </section>
                    <section>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Dietary Preferences</h3>
                        <div className="flex items-center justify-between bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-800 flex items-center gap-2">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-green-600"><rect x="1.5" y="1.5" width="13" height="13" stroke="currentColor" strokeWidth="1.5" rx="1" /><circle cx="8" cy="8" r="3.5" fill="currentColor" /></svg>
                                    Pure Veg Only
                                </span>
                                <span className="text-xs font-medium text-slate-500 mt-0.5">Only show restaurants with 100% vegetarian menus.</span>
                            </div>
                            <button onClick={() => setIsVegOnly(!isVegOnly)} className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${isVegOnly ? 'bg-green-500' : 'bg-slate-300'}`}>
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${isVegOnly ? 'translate-x-7' : 'translate-x-1'}`}></div>
                            </button>
                        </div>
                    </section>
                    <section>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Expand Your Account</h3>
                        <div className="space-y-3">
                            {/* VENDOR UPGRADE/SWITCH */}
                            {userRoles.includes('Vendor') ? (
                                <button onClick={() => { setIsSettingsOpen(false); navigate('/vendor/dashboard'); }} className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-teal-600 p-2 rounded-lg text-white">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                        </div>
                                        <div className="text-left">
                                            <span className="block font-bold text-slate-800">Partner Dashboard</span>
                                            <span className="block text-xs font-medium text-slate-500">Manage your restaurants</span>
                                        </div>
                                    </div>
                                    <svg className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                </button>
                            ) : (
                                <button onClick={() => setUpgradeIntent('Vendor')} className="w-full flex items-center justify-between p-4 rounded-2xl border border-teal-100 bg-teal-50 hover:bg-teal-100 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-teal-500 p-2 rounded-lg text-white">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                        </div>
                                        <div className="text-left">
                                            <span className="block font-bold text-teal-900">Become a Partner</span>
                                            <span className="block text-xs font-medium text-teal-700">Add a restaurant dashboard</span>
                                        </div>
                                    </div>
                                    <svg className="w-5 h-5 text-teal-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                </button>
                            )}

                            {/* DRIVER UPGRADE/SWITCH */}
                            {userRoles.includes('Driver') ? (
                                <button onClick={() => { setIsSettingsOpen(false); navigate('/driver/dashboard'); }} className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-600 p-2 rounded-lg text-white">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                                        </div>
                                        <div className="text-left">
                                            <span className="block font-bold text-slate-800">Driver Dashboard</span>
                                            <span className="block text-xs font-medium text-slate-500">Find active delivery routes</span>
                                        </div>
                                    </div>
                                    <svg className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                </button>
                            ) : (
                                <button onClick={() => setUpgradeIntent('Driver')} className="w-full flex items-center justify-between p-4 rounded-2xl border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-500 p-2 rounded-lg text-white">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                                        </div>
                                        <div className="text-left">
                                            <span className="block font-bold text-blue-900">Drive With Us</span>
                                            <span className="block text-xs font-medium text-blue-700">Add a driver dashboard</span>
                                        </div>
                                    </div>
                                    <svg className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                </button>
                            )}
                        </div>
                    </section>
                    <section className="pt-6 border-t border-slate-100">
                        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-bold py-3.5 rounded-xl hover:bg-red-100 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            Log Out
                        </button>
                    </section>
                </div>
            </div>
        </div>
    );
}