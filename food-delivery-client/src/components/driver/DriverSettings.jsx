import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DriverSettings() {
    const navigate = useNavigate();
    
    // Profile State
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: "Samiul Shaikh",
        phone: "+91 98765 43210",
        vehicle: "2019 Honda Livo",
        plate: "GJ-06-AB-1234"
    });

    // Preferences State
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });

    const handleSaveProfile = () => {
        setIsEditing(false);
        // API call to update profile
    };

    const handleUpdatePassword = (e) => {
        e.preventDefault();
        // API call to update password would go here
        setShowPasswordForm(false);
        setPasswords({ current: "", new: "", confirm: "" });
    };

    const handleLogout = () => {
        navigate("/driver/login");
    };

    return (
        <div className="p-6 animate-fade-in pb-24">
            <h2 className="text-2xl font-extrabold text-slate-800 mb-6">Settings</h2>

            {/* Profile & Vehicle Details */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-6">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800">Account Details</h3>
                    {!isEditing ? (
                        <button onClick={() => setIsEditing(true)} className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">Edit</button>
                    ) : (
                        <button onClick={handleSaveProfile} className="text-xs font-bold text-white bg-blue-600 px-3 py-1.5 rounded-lg shadow-sm">Save</button>
                    )}
                </div>
                <div className="p-5 space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                        <input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} disabled={!isEditing} className={`w-full font-bold text-slate-800 rounded-xl px-3 py-2 transition-colors ${isEditing ? 'bg-white border-2 border-blue-500 focus:outline-none' : 'bg-slate-50 border border-slate-100'}`} />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Vehicle</label>
                        <input type="text" value={profile.vehicle} onChange={(e) => setProfile({...profile, vehicle: e.target.value})} disabled={!isEditing} className={`w-full font-bold text-slate-800 rounded-xl px-3 py-2 transition-colors ${isEditing ? 'bg-white border-2 border-blue-500 focus:outline-none' : 'bg-slate-50 border border-slate-100'}`} />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">License Plate</label>
                        <input type="text" value={profile.plate} onChange={(e) => setProfile({...profile, plate: e.target.value})} disabled={!isEditing} className={`w-full font-bold text-slate-800 rounded-xl px-3 py-2 transition-colors ${isEditing ? 'bg-white border-2 border-blue-500 focus:outline-none' : 'bg-slate-50 border border-slate-100'}`} />
                    </div>
                </div>
            </div>

            {/* App Preferences */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-6">
                <div className="p-5 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800">Security</h3>
                </div>
                <div className="p-2">
                    {/* Expandable Password Form */}
                    <button onClick={() => setShowPasswordForm(!showPasswordForm)} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                        <span className="font-medium text-slate-700 text-sm">Change Password</span>
                        <svg className={`w-4 h-4 text-slate-400 transition-transform ${showPasswordForm ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>

                    {showPasswordForm && (
                        <form onSubmit={handleUpdatePassword} className="p-3 bg-slate-50 rounded-xl mt-2 space-y-3 border border-slate-100 animate-fade-in">
                            <input type="password" placeholder="Current Password" required value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} className="w-full bg-white border border-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <input type="password" placeholder="New Password" required value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} className="w-full bg-white border border-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <input type="password" placeholder="Confirm New Password" required value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} className="w-full bg-white border border-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <div className="flex gap-2 pt-1">
                                <button type="button" onClick={() => setShowPasswordForm(false)} className="flex-1 text-xs font-bold text-slate-500 bg-white border border-slate-200 py-2 rounded-lg">Cancel</button>
                                <button type="submit" className="flex-1 text-xs font-bold text-white bg-blue-600 py-2 rounded-lg">Update</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* Danger Zone */}
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-bold px-6 py-4 rounded-2xl hover:bg-red-100 transition-colors shadow-sm border border-red-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Log Out of Shift
            </button>
        </div>
    );
}