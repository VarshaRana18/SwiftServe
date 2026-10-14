import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function VendorSettings({ activeRestaurantId }) {
    const navigate = useNavigate();
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    // User Roles & Upgrade State
    const [userRoles, setUserRoles] = useState([]);
    const [upgradeIntent, setUpgradeIntent] = useState(null);
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [upgradeError, setUpgradeError] = useState("");

    // Restaurant Profile State
    const [restaurantProfile, setRestaurantProfile] = useState({
        name: "Loading...",
        phone: "",
        address: "Loading...",
        description: "Loading...",
        city: "",
        pinCode: ""
    });

    // Load roles on mount
    useEffect(() => {
        try {
            const roles = JSON.parse(localStorage.getItem('roles') || '["Vendor"]');
            setUserRoles(roles);
        } catch (e) {
            setUserRoles(['Vendor']);
        }
    }, []);

    useEffect(() => {
        if (!activeRestaurantId) return;

        const fetchRestDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:5121/api/restaurant/my-restaurants`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    const currentRest = data.find(r => r.id === activeRestaurantId);
                    
                    if (currentRest) {
                        setRestaurantProfile({
                            name: currentRest.name,
                            phone: currentRest.contactNumber || "", 
                            address: currentRest.fullAddress || "",
                            description: currentRest.description || "",
                            city: currentRest.city || "Vadodara",
                            pinCode: currentRest.pinCode || ""
                        });
                    }
                }
            } catch (error) {
                console.error("Failed to fetch settings data");
            }
        };

        fetchRestDetails();
    }, [activeRestaurantId]);

    const handleSaveProfile = async () => {
        setIsSaving(true);
        const token = localStorage.getItem('token');
        
        try {
            const response = await fetch(`http://localhost:5121/api/restaurant/${activeRestaurantId}`, {
                method: "PUT",
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    name: restaurantProfile.name,
                    description: restaurantProfile.description,
                    FullAddress: restaurantProfile.address, 
                    city: restaurantProfile.city,
                    pinCode: restaurantProfile.pinCode,
                    contactNumber: restaurantProfile.phone
                })
            });

            if (response.ok) {
                setIsEditingProfile(false);
            } else {
                console.error("Failed to update profile");
            }
        } catch (error) {
            console.error("Network error");
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
                
                // Silently swap token and update roles
                localStorage.setItem('token', data.token);
                localStorage.setItem('roles', JSON.stringify(data.roles));
                setUserRoles(data.roles);
                
                // Route to customer marketplace
                if (newRole === 'Customer') navigate('/');
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
        navigate("/vendor/login");
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20 relative">
            
            {/* UPGRADE CONFIRMATION MODAL (Customer) */}
            {upgradeIntent === 'Customer' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setUpgradeIntent(null)}></div>
                    <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden animate-slide-up p-8 text-center">
                        <button onClick={() => setUpgradeIntent(null)} disabled={isUpgrading} className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        
                        <div className="w-20 h-20 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Order food?</h2>
                        <p className="text-slate-500 font-medium mb-8">
                            Activate your Customer profile to start ordering from other SwiftServe partner restaurants.
                        </p>
                        
                        {upgradeError && <p className="text-sm text-red-500 font-bold mb-4">{upgradeError}</p>}
                        
                        <button 
                            onClick={() => handleRoleUpgrade('Customer')} 
                            disabled={isUpgrading}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-orange-200 active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
                        >
                            {isUpgrading ? "Activating Profile..." : "Enable Customer Profile"}
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
                    <span className="text-sm font-bold text-slate-400 mb-1">Today's Revenue</span>
                    <span className="text-3xl font-extrabold text-teal-600">₹12,450</span>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
                    <span className="text-sm font-bold text-slate-400 mb-1">Completed Orders</span>
                    <span className="text-3xl font-extrabold text-slate-800">42</span>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
                    <span className="text-sm font-bold text-slate-400 mb-1">Avg. Prep Time</span>
                    <span className="text-3xl font-extrabold text-slate-800">14<span className="text-lg text-slate-400"> mins</span></span>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-800">Restaurant Profile</h2>
                    {!isEditingProfile ? (
                        <button onClick={() => setIsEditingProfile(true)} className="text-sm font-bold text-teal-600 hover:text-teal-700 bg-teal-50 px-4 py-1.5 rounded-lg transition-colors">Edit Details</button>
                    ) : (
                        <button onClick={handleSaveProfile} disabled={isSaving} className={`text-sm font-bold text-white px-4 py-1.5 rounded-lg transition-colors shadow-sm ${isSaving ? 'bg-teal-400 cursor-wait' : 'bg-teal-600 hover:bg-teal-700'}`}>
                            {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                    )}
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Restaurant Name</label>
                            <input type="text" value={restaurantProfile.name} onChange={(e) => setRestaurantProfile({ ...restaurantProfile, name: e.target.value })} disabled={!isEditingProfile} className={`w-full font-bold text-slate-800 rounded-xl px-4 py-3 transition-colors ${isEditingProfile ? 'bg-white border-2 border-teal-500 focus:outline-none' : 'bg-slate-50 border border-slate-100'}`} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Contact Phone</label>
                            <input type="text" value={restaurantProfile.phone} onChange={(e) => setRestaurantProfile({ ...restaurantProfile, phone: e.target.value })} disabled={!isEditingProfile} className={`w-full font-bold text-slate-800 rounded-xl px-4 py-3 transition-colors ${isEditingProfile ? 'bg-white border-2 border-teal-500 focus:outline-none' : 'bg-slate-50 border border-slate-100'}`} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Address</label>
                        <input type="text" value={restaurantProfile.address} onChange={(e) => setRestaurantProfile({ ...restaurantProfile, address: e.target.value })} disabled={!isEditingProfile} className={`w-full font-bold text-slate-800 rounded-xl px-4 py-3 transition-colors ${isEditingProfile ? 'bg-white border-2 border-teal-500 focus:outline-none' : 'bg-slate-50 border border-slate-100'}`} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Short Description</label>
                        <textarea value={restaurantProfile.description} onChange={(e) => setRestaurantProfile({ ...restaurantProfile, description: e.target.value })} disabled={!isEditingProfile} rows="2" className={`w-full font-bold text-slate-800 rounded-xl px-4 py-3 transition-colors resize-none ${isEditingProfile ? 'bg-white border-2 border-teal-500 focus:outline-none' : 'bg-slate-50 border border-slate-100'}`} />
                    </div>
                </div>
            </div>

            {/* ACCOUNT & PROFILES SECTION */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800">Account & Profiles</h2>
                </div>
                <div className="p-6 space-y-3">
                    
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

                    <button disabled={true} className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50 opacity-70 cursor-not-allowed">
                        <div className="flex items-center gap-3">
                            <div className="bg-slate-300 p-2 rounded-lg text-white">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                            </div>
                            <div className="text-left">
                                <span className="block font-bold text-slate-500">Drive With Us</span>
                                <span className="block text-xs font-medium text-slate-400">Add a driver dashboard</span>
                            </div>
                        </div>
                        <span className="text-[10px] font-bold bg-slate-200 text-slate-500 px-2 py-1 rounded-md uppercase">Coming Soon</span>
                    </button>
                </div>
            </div>

            <div className="bg-red-50 rounded-2xl border border-red-100 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h3 className="font-bold text-red-800">End Session</h3>
                    <p className="text-sm font-medium text-red-600/80">Log out of the kitchen display system.</p>
                </div>
                <button onClick={handleLogout} className="flex items-center justify-center gap-2 bg-white text-red-600 font-bold px-6 py-3 rounded-xl hover:bg-red-50 transition-colors shadow-sm border border-red-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Log Out
                </button>
            </div>
        </div>
    );
}