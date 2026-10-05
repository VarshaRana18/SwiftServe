import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function VendorSettings({ activeRestaurantId }) {
    const navigate = useNavigate();
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [restaurantProfile, setRestaurantProfile] = useState({
        name: "Loading...",
        phone: "+91 98765 43210", // Note: Phone is not currently in Restaurant.cs
        address: "Loading...",
        description: "Loading..."
    });

    useEffect(() => {
        if (!activeRestaurantId) return;

        const fetchRestDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5121/api/restaurant`);
                if (response.ok) {
                    const data = await response.json();
                    const currentRest = data.find(r => r.id === activeRestaurantId);
                    if (currentRest) {
                        setRestaurantProfile({
                            name: currentRest.name,
                            phone: "+91 98765 43210", // Placeholder until added to model
                            address: currentRest.fullAddress,
                            description: currentRest.description || ""
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
        // TODO: Wire to Varsha's upcoming PUT /api/restaurant/{id} endpoint
        /*
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:5121/api/restaurant/${activeRestaurantId}`, {
            method: "PUT",
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({
                name: restaurantProfile.name,
                description: restaurantProfile.description,
                fullAddress: restaurantProfile.address
            })
        });
        */
        
        setTimeout(() => {
            setIsSaving(false);
            setIsEditingProfile(false);
        }, 800);
    };

    const handleLogout = () => {
        navigate("/vendor/login");
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
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