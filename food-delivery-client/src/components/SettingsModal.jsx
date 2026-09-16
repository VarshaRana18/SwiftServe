import { useState } from "react";
import { useCart } from "../context/CartContext";
// NEW: Import the router hook
import { useNavigate } from "react-router-dom"; 

export default function SettingsModal() {
    const { isSettingsOpen, setIsSettingsOpen, isVegOnly, setIsVegOnly, userProfile, setUserProfile } = useCart();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(userProfile);
    
    // NEW: Initialize the navigate function
    const navigate = useNavigate(); 

    if (!isSettingsOpen) return null;

    const handleSave = () => {
        setUserProfile(formData);
        setIsEditing(false);
    };

    const handleLogout = () => {
        setIsSettingsOpen(false);
        // NEW: Actually push the user to your real login route
        navigate("/login"); 
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsSettingsOpen(false)}></div>
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
                
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800">Settings</h2>
                    <button onClick={() => setIsSettingsOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="p-6 space-y-8 max-h-[80vh] overflow-y-auto">
                    
                    {/* Profile Management */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Account Details</h3>
                            {!isEditing ? (
                                <button onClick={() => setIsEditing(true)} className="text-sm font-bold text-orange-500 hover:text-orange-600">Edit</button>
                            ) : (
                                <button onClick={handleSave} className="text-sm font-bold text-green-500 hover:text-green-600">Save</button>
                            )}
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Full Name</label>
                                <input 
                                    type="text" 
                                    value={isEditing ? formData.name : userProfile.name} 
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    disabled={!isEditing} 
                                    className={`w-full font-bold text-slate-800 rounded-xl px-4 py-3 transition-colors ${isEditing ? 'bg-white border-2 border-orange-500 focus:outline-none' : 'bg-slate-50 border border-slate-100'}`} 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">Email Address</label>
                                <input 
                                    type="email" 
                                    value={isEditing ? formData.email : userProfile.email} 
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    disabled={!isEditing} 
                                    className={`w-full font-bold text-slate-800 rounded-xl px-4 py-3 transition-colors ${isEditing ? 'bg-white border-2 border-orange-500 focus:outline-none' : 'bg-slate-50 border border-slate-100'}`} 
                                />
                            </div>
                        </div>
                    </section>

                    {/* Dietary Global Filter */}
                    <section>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Dietary Preferences</h3>
                        <div className="flex items-center justify-between bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-800 flex items-center gap-2">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-600">
                                        <rect x="1.5" y="1.5" width="13" height="13" stroke="currentColor" strokeWidth="1.5" rx="1"/>
                                        <circle cx="8" cy="8" r="3.5" fill="currentColor"/>
                                    </svg>
                                    Pure Veg Only
                                </span>
                                <span className="text-xs font-medium text-slate-500">Only show restaurants with 100% vegetarian menus.</span>
                            </div>
                            
                            {/* Toggle Switch */}
                            <button 
                                onClick={() => setIsVegOnly(!isVegOnly)}
                                className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${isVegOnly ? 'bg-green-500' : 'bg-slate-300'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${isVegOnly ? 'translate-x-7' : 'translate-x-1'}`}></div>
                            </button>
                        </div>
                    </section>

                    {/* Danger Zone */}
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