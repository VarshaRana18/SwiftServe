import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function DriverSettings() {
    const navigate = useNavigate();
    
    // Profile State
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [profile, setProfile] = useState({
        name: "Loading...",
        email: "Loading...",
        phone: ""
    });

    // Role Upgrade States
    const [userRoles, setUserRoles] = useState([]);
    const [upgradeIntent, setUpgradeIntent] = useState(null); // 'Customer', 'Vendor', or null
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [upgradeError, setUpgradeError] = useState("");

    // Decode JWT on mount to pre-fill name and email, and load roles
    useEffect(() => {
        try {
            const roles = JSON.parse(localStorage.getItem('roles') || '["Driver"]');
            setUserRoles(roles);
        } catch (e) {
            setUserRoles(['Driver']);
        }

        const token = localStorage.getItem('token');
        if (token) {
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));

                const payload = JSON.parse(jsonPayload);
                const emailClaim = payload.email || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || "";
                const nameClaim = payload.fullName || payload.name || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "Driver";
                
                // Read from either driver or customer cache
                const phoneCache = localStorage.getItem('driverPhone') || localStorage.getItem('customerPhone') || "";

                setProfile({ name: nameClaim, email: emailClaim, phone: phoneCache });
            } catch (e) {
                console.error("Failed to decode token");
            }
        }
    }, []);

    const handleSaveProfile = async () => {
        if (!profile.phone || profile.phone.length < 8) {
            alert("Please enter a valid contact number.");
            return;
        }

        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch("http://localhost:5121/api/auth/profile", {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    fullName: profile.name,
                    email: profile.email,
                    phoneNumber: profile.phone
                })
            });

            if (response.ok) {
                // Keep cross-platform sync
                localStorage.setItem('driverPhone', profile.phone);
                localStorage.setItem('customerPhone', profile.phone); 
                setIsEditing(false);
            } else {
                alert("Failed to save profile details.");
            }
        } catch (error) {
            console.error("Profile update error:", error);
            alert("Network error. Please try again.");
        } finally {
            setIsSaving(false);
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
                setUserRoles(data.roles);
                
                setUpgradeIntent(null);
                if (newRole === 'Customer') navigate('/');
                if (newRole === 'Vendor') navigate('/vendor/dashboard');
            } else {
                setUpgradeError(`Failed to activate ${newRole} profile.`);
            }
        } catch (error) {
            setUpgradeError("Network error. Could not reach server.");
        } finally {
            setIsUpgrading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('roles');
        // Do not remove the phone cache so they don't have to retype it if they log back in
        navigate("/driver/login");
    };

    return (
        <div className="p-6 animate-fade-in pb-24 relative">
            
            {/* UPGRADE CONFIRMATION MODAL */}
            {upgradeIntent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setUpgradeIntent(null)}></div>
                    <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden animate-slide-up p-8 text-center">
                        <button onClick={() => setUpgradeIntent(null)} disabled={isUpgrading} className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${upgradeIntent === 'Customer' ? 'bg-orange-100 text-orange-500' : 'bg-teal-100 text-teal-600'}`}>
                            {upgradeIntent === 'Customer' ? (
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                            ) : (
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            )}
                        </div>
                        
                        <h2 className="text-2xl font-extrabold text-slate-800 mb-2">
                            {upgradeIntent === 'Customer' ? "Order food?" : "Ready to grow your business?"}
                        </h2>
                        <p className="text-slate-500 font-medium mb-8">
                            {upgradeIntent === 'Customer' 
                                ? "Activate your Customer profile to start ordering from other SwiftServe partner restaurants."
                                : "Upgrade to a Partner account to unlock your dedicated kitchen display, menu manager, and live order tracking."}
                        </p>
                        
                        {upgradeError && <p className="text-sm text-red-500 font-bold mb-4">{upgradeError}</p>}
                        
                        <button 
                            onClick={() => handleRoleUpgrade(upgradeIntent)} 
                            disabled={isUpgrading}
                            className={`w-full text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2 ${upgradeIntent === 'Customer' ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-200' : 'bg-teal-600 hover:bg-teal-700 shadow-teal-200'}`}
                        >
                            {isUpgrading ? "Activating Profile..." : `Enable ${upgradeIntent} Profile`}
                        </button>
                    </div>
                </div>
            )}

            <h2 className="text-2xl font-extrabold text-slate-800 mb-6">Settings</h2>
            
            {/* Unified Profile Details */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-6">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800">Account Details</h3>
                    {!isEditing ? (
                        <button onClick={() => setIsEditing(true)} className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">Edit</button>
                    ) : (
                        <button onClick={handleSaveProfile} disabled={isSaving} className="text-xs font-bold text-white bg-blue-600 px-3 py-1.5 rounded-lg shadow-sm disabled:opacity-50">
                            {isSaving ? "Saving..." : "Save"}
                        </button>
                    )}
                </div>
                
                <div className="p-5 space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                        <input 
                            type="text" 
                            value={profile.name} 
                            onChange={(e) => setProfile({...profile, name: e.target.value})} 
                            disabled={!isEditing} 
                            className={`w-full font-bold text-slate-800 rounded-xl px-3 py-2 transition-colors ${isEditing ? 'bg-white border-2 border-blue-500 focus:outline-none' : 'bg-slate-50 border border-slate-100'}`}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
                        <input 
                            type="email" 
                            value={profile.email} 
                            onChange={(e) => setProfile({...profile, email: e.target.value})} 
                            disabled={!isEditing} 
                            className={`w-full font-bold text-slate-800 rounded-xl px-3 py-2 transition-colors ${isEditing ? 'bg-white border-2 border-blue-500 focus:outline-none' : 'bg-slate-50 border border-slate-100'}`}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex justify-between">
                            Contact Number
                            {!profile.phone && !isEditing && <span className="text-red-500">*Required</span>}
                        </label>
                        <input 
                            type="tel" 
                            value={profile.phone} 
                            onChange={(e) => setProfile({...profile, phone: e.target.value})} 
                            disabled={!isEditing} 
                            placeholder="+91 9876543210"
                            className={`w-full font-bold text-slate-800 rounded-xl px-3 py-2 transition-colors ${isEditing ? 'bg-white border-2 border-blue-500 focus:outline-none' : 'bg-slate-50 border border-slate-100'} ${!profile.phone && !isEditing ? 'border-red-200 bg-red-50' : ''}`}
                        />
                    </div>
                </div>
            </div>

            {/* ACCOUNT & PROFILES SECTION */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-6">
                <div className="p-5 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800">Account & Profiles</h3>
                </div>
                <div className="p-5 space-y-3">
                    
                    {/* CUSTOMER SWITCH/UPGRADE */}
                    {userRoles.includes('Customer') ? (
                        <button onClick={() => navigate('/')} className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="bg-orange-500 p-2 rounded-lg text-white">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                </div>
                                <div className="text-left">
                                    <span className="block font-bold text-slate-800">Switch to Customer App</span>
                                    <span className="block text-xs font-medium text-slate-500">Order food from other restaurants</span>
                                </div>
                            </div>
                            <svg className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                        </button>
                    ) : (
                        <button onClick={() => setUpgradeIntent('Customer')} className="w-full flex items-center justify-between p-4 rounded-2xl border border-orange-100 bg-orange-50 hover:bg-orange-100 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="bg-orange-500 p-2 rounded-lg text-white">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                </div>
                                <div className="text-left">
                                    <span className="block font-bold text-orange-900">Enable Food Ordering</span>
                                    <span className="block text-xs font-medium text-orange-700">Activate your Customer profile</span>
                                </div>
                            </div>
                            <svg className="w-5 h-5 text-orange-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                        </button>
                    )}

                    {/* VENDOR SWITCH/UPGRADE */}
                    {userRoles.includes('Vendor') ? (
                        <button onClick={() => navigate('/vendor/dashboard')} className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors group">
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
                </div>
            </div>

            {/* Danger Zone */}
            <button 
                onClick={handleLogout} 
                className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-bold px-6 py-4 rounded-2xl hover:bg-red-100 transition-colors shadow-sm border border-red-100"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Log Out of Shift
            </button>
        </div>
    );
}