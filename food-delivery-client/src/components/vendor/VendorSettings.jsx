import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function VendorSettings({ activeRestaurantId }) {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    // User Roles & Upgrade State
    const [userRoles, setUserRoles] = useState([]);
    const [upgradeIntent, setUpgradeIntent] = useState(null);
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [upgradeError, setUpgradeError] = useState("");

    // Restaurant Profile State (Added imageUrl)
    const [restaurantProfile, setRestaurantProfile] = useState({
        name: "Loading...",
        phone: "",
        address: "Loading...",
        description: "Loading...",
        city: "",
        pinCode: "",
        imageUrl: "" // NEW
    });

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
                            pinCode: currentRest.pinCode || "",
                            imageUrl: currentRest.imageUrl || "" // NEW
                        });
                    }
                }
            } catch (error) {
                console.error("Failed to fetch settings data");
            }
        };
        fetchRestDetails();
    }, [activeRestaurantId]);

    // NEW: Handle Instant Image Upload
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploadingImage(true);
        const token = localStorage.getItem('token');
        
        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const response = await fetch('http://localhost:5121/api/imageupload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: uploadData
            });

            if (response.ok) {
                const data = await response.json();
                // Assumes the backend returns { imageUrl: "https://cloudinary..." }
                const uploadedUrl = data.imageUrl || data.url; 
                setRestaurantProfile(prev => ({ ...prev, imageUrl: uploadedUrl }));
            } else {
                alert("Failed to upload image. Please try again.");
            }
        } catch (error) {
            console.error("Image upload failed:", error);
            alert("Network error during image upload.");
        } finally {
            setIsUploadingImage(false);
            // Reset input so they can upload the same file again if needed
            if (fileInputRef.current) fileInputRef.current.value = ""; 
        }
    };

    // UPDATED: Now includes imageUrl in the payload
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
                    contactNumber: restaurantProfile.phone,
                    imageUrl: restaurantProfile.imageUrl // NEW
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
                localStorage.setItem('token', data.token);
                localStorage.setItem('roles', JSON.stringify(data.roles));
                setUserRoles(data.roles);
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
                        <p className="text-slate-500 font-medium mb-8">Activate your Customer profile to start ordering from other SwiftServe partner restaurants.</p>
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
                    <span className="text-3xl font-extrabold text-slate-800">14 <span className="text-lg text-slate-400">mins</span></span>
                </div>
            </div>

            {/* RESTAURANT PROFILE COMPONENT */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-800">Restaurant Profile</h2>
                    {!isEditingProfile ? (
                        <button onClick={() => setIsEditingProfile(true)} className="text-sm font-bold text-teal-600 hover:text-teal-700 bg-teal-50 px-4 py-1.5 rounded-lg transition-colors">
                            Edit Details
                        </button>
                    ) : (
                        <button onClick={handleSaveProfile} disabled={isSaving || isUploadingImage} className={`text-sm font-bold text-white px-4 py-1.5 rounded-lg transition-colors shadow-sm ${isSaving || isUploadingImage ? 'bg-teal-400 cursor-wait' : 'bg-teal-600 hover:bg-teal-700'}`}>
                            {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                    )}
                </div>
                
                <div className="p-6 space-y-6">
                    {/* NEW: Cover Image Uploader */}
                    <div className="w-full">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Cover Photo</label>
                        <div 
                            onClick={() => isEditingProfile && fileInputRef.current?.click()}
                            className={`relative w-full h-48 sm:h-56 rounded-xl overflow-hidden border-2 ${isEditingProfile ? 'cursor-pointer hover:border-teal-500 border-dashed border-slate-300 bg-slate-50' : 'border-slate-100 bg-slate-100'} transition-colors group flex items-center justify-center`}
                        >
                            {/* Hidden file input */}
                            <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                ref={fileInputRef} 
                                onChange={handleImageUpload} 
                                disabled={!isEditingProfile || isUploadingImage}
                            />

                            {isUploadingImage ? (
                                <div className="flex flex-col items-center gap-2 text-teal-600">
                                    <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    <span className="text-sm font-bold animate-pulse">Uploading to Cloudinary...</span>
                                </div>
                            ) : restaurantProfile.imageUrl ? (
                                <>
                                    <img src={restaurantProfile.imageUrl} alt="Cover" className="w-full h-full object-cover" />
                                    {isEditingProfile && (
                                        <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                            <span className="bg-white/90 text-slate-800 font-bold px-4 py-2 rounded-lg flex items-center gap-2">
                                                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                Change Cover Photo
                                            </span>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-teal-500 transition-colors">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    <span className="text-sm font-bold">{isEditingProfile ? "Click to upload image" : "No cover photo"}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Standard Text Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Restaurant Name</label>
                            <input 
                                type="text" 
                                value={restaurantProfile.name} 
                                onChange={(e) => setRestaurantProfile({...restaurantProfile, name: e.target.value})} 
                                disabled={!isEditingProfile} 
                                className={`w-full font-bold text-slate-800 rounded-xl px-4 py-3 transition-colors ${isEditingProfile ? 'bg-white border-2 border-teal-500 focus:outline-none' : 'bg-slate-50 border border-slate-100'}`}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Contact Phone</label>
                            <input 
                                type="text" 
                                value={restaurantProfile.phone} 
                                onChange={(e) => setRestaurantProfile({...restaurantProfile, phone: e.target.value})} 
                                disabled={!isEditingProfile} 
                                className={`w-full font-bold text-slate-800 rounded-xl px-4 py-3 transition-colors ${isEditingProfile ? 'bg-white border-2 border-teal-500 focus:outline-none' : 'bg-slate-50 border border-slate-100'}`}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Address</label>
                        <input 
                            type="text" 
                            value={restaurantProfile.address} 
                            onChange={(e) => setRestaurantProfile({...restaurantProfile, address: e.target.value})} 
                            disabled={!isEditingProfile} 
                            className={`w-full font-bold text-slate-800 rounded-xl px-4 py-3 transition-colors ${isEditingProfile ? 'bg-white border-2 border-teal-500 focus:outline-none' : 'bg-slate-50 border border-slate-100'}`}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Short Description</label>
                        <textarea 
                            value={restaurantProfile.description} 
                            onChange={(e) => setRestaurantProfile({...restaurantProfile, description: e.target.value})} 
                            disabled={!isEditingProfile} 
                            rows="2" 
                            className={`w-full font-bold text-slate-800 rounded-xl px-4 py-3 transition-colors resize-none ${isEditingProfile ? 'bg-white border-2 border-teal-500 focus:outline-none' : 'bg-slate-50 border border-slate-100'}`}
                        />
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