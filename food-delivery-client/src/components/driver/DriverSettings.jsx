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

    // Decode JWT on mount to pre-fill name and email
    useEffect(() => {
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

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('roles');
        // Do not remove the phone cache so they don't have to retype it if they log back in
        navigate("/driver/login");
    };

    return (
        <div className="p-6 animate-fade-in pb-24">
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