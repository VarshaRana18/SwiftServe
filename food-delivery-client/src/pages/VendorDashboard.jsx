import { useState, useEffect, useRef } from "react";
import VendorOrders from "../components/vendor/VendorOrders";
import VendorMenu from "../components/vendor/VendorMenu";
import VendorSettings from "../components/vendor/VendorSettings";

export default function VendorDashboard() {
    // Dashboard States
    const [activeTab, setActiveTab] = useState("Orders");
    const [isAcceptingOrders, setIsAcceptingOrders] = useState(true);

    // Restaurant Management States
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // NEW: Image Upload States for Registration Form
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const fileInputRef = useRef(null);

    // Form State (Added imageUrl)
    const [formData, setFormData] = useState({
        name: "", description: "", contactNumber: "", 
        fullAddress: "", city: "Vadodara", pinCode: "",
        imageUrl: "" // NEW
    });

    const navItems = [
        { name: "Orders", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
        { name: "Menu", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
        { name: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c-.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" }
    ];

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch("http://localhost:5121/api/restaurant/my-restaurants", {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const myRestaurants = await response.json();
                    setRestaurants(myRestaurants);
                    if (myRestaurants.length > 0) {
                        setSelectedRestaurant(myRestaurants[0]);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch restaurants");
            }
        };
        fetchRestaurants();
    }, []);

    useEffect(() => {
        if (selectedRestaurant) {
            setIsAcceptingOrders(selectedRestaurant.isOpen !== false);
        }
    }, [selectedRestaurant]);

    // NEW: Handle Instant Image Upload for Registration Form
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
                const uploadedUrl = data.imageUrl || data.url; 
                setFormData(prev => ({ ...prev, imageUrl: uploadedUrl }));
            } else {
                alert("Failed to upload image. Please try again.");
            }
        } catch (error) {
            console.error("Image upload failed:", error);
            alert("Network error during image upload.");
        } finally {
            setIsUploadingImage(false);
            if (fileInputRef.current) fileInputRef.current.value = ""; 
        }
    };

    // UPDATED: Include imageUrl in POST payload
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const token = localStorage.getItem('token');
        
        try {
            const response = await fetch("http://localhost:5121/api/restaurant", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    FullAddress: formData.fullAddress,
                    city: formData.city,
                    pinCode: formData.pinCode,
                    contactNumber: formData.contactNumber,
                    imageUrl: formData.imageUrl // NEW
                })
            });

            if (response.ok) {
                const newRest = await response.json();
                setRestaurants(prev => [...prev, newRest]);
                setSelectedRestaurant(newRest);
                setIsCreating(false);
                setFormData({ name: "", description: "", contactNumber: "", fullAddress: "", city: "Vadodara", pinCode: "", imageUrl: "" });
            } else {
                console.error("Failed to save to database");
            }
        } catch (error) {
            console.error("Network error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleStatus = async () => {
        if (!selectedRestaurant) return;
        const newStatus = !isAcceptingOrders;
        setIsAcceptingOrders(newStatus);
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5121/api/restaurant/${selectedRestaurant.id}/toggle-status`, {
                method: "PATCH",
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setSelectedRestaurant(prev => ({ ...prev, isOpen: newStatus }));
                setRestaurants(prev => prev.map(r => r.id === selectedRestaurant.id ? { ...r, isOpen: newStatus } : r));
            } else {
                setIsAcceptingOrders(!newStatus);
            }
        } catch (error) {
            setIsAcceptingOrders(!newStatus);
        }
    };

    if (restaurants.length === 0 || isCreating) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                    <div className="bg-teal-600 p-8 text-white text-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        </div>
                        <h1 className="text-2xl font-bold mb-2">{restaurants.length === 0 ? "Welcome to Swift Partner!" : "Add Another Restaurant"}</h1>
                        <p className="text-teal-100 text-sm">{restaurants.length === 0 ? "Let's get your first restaurant set up so you can start receiving orders." : "Expand your business presence on the platform."}</p>
                    </div>
                    
                    <form onSubmit={handleFormSubmit} className="p-8 space-y-5">
                        
                        {/* NEW: Registration Cover Photo Uploader */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Cover Photo (Optional)</label>
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full h-40 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:border-teal-500 transition-colors cursor-pointer flex flex-col items-center justify-center relative overflow-hidden group"
                            >
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    ref={fileInputRef} 
                                    onChange={handleImageUpload} 
                                    disabled={isUploadingImage}
                                />
                                
                                {isUploadingImage ? (
                                    <div className="flex flex-col items-center gap-2 text-teal-600">
                                        <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        <span className="text-xs font-bold animate-pulse">Uploading...</span>
                                    </div>
                                ) : formData.imageUrl ? (
                                    <>
                                        <img src={formData.imageUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">Change Photo</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-slate-400 group-hover:text-teal-500 flex flex-col items-center gap-2 transition-colors">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        <span className="text-sm font-bold">Click to upload image</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Restaurant Name *</label>
                                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600 outline-none bg-slate-50 focus:bg-white transition-colors" placeholder="e.g. Firehouse Grill" />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Contact Phone *</label>
                                <input type="text" required value={formData.contactNumber} onChange={(e) => setFormData({...formData, contactNumber: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600 outline-none bg-slate-50 focus:bg-white transition-colors" placeholder="e.g. +91 98765 43210" />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600 outline-none bg-slate-50 focus:bg-white transition-colors resize-none" rows="2" placeholder="Briefly describe your cuisine and specialties..." />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Full Street Address *</label>
                                <input type="text" required value={formData.fullAddress} onChange={(e) => setFormData({...formData, fullAddress: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600 outline-none bg-slate-50 focus:bg-white transition-colors" placeholder="Shop No, Building, Area" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">City *</label>
                                <input type="text" required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600 outline-none bg-slate-50 focus:bg-white transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Pin Code *</label>
                                <input type="text" required value={formData.pinCode} onChange={(e) => setFormData({...formData, pinCode: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-600 outline-none bg-slate-50 focus:bg-white transition-colors" placeholder="390001" />
                            </div>
                        </div>
                        
                        <div className="pt-4 flex gap-3">
                            {restaurants.length > 0 && (
                                <button type="button" onClick={() => setIsCreating(false)} className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors">Cancel</button>
                            )}
                            <button type="submit" disabled={isLoading || isUploadingImage} className={`flex-[2] py-3.5 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-70 ${isLoading || isUploadingImage ? 'bg-teal-400 cursor-wait' : 'bg-teal-600 hover:bg-teal-700 shadow-teal-200'}`}>
                                {isLoading ? "Registering..." : "Register Restaurant"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-slate-50 flex flex-col lg:flex-row font-sans overflow-hidden">
            {/* MOBILE HEADER */}
            <div className="lg:hidden flex flex-col shrink-0 bg-white border-b border-slate-200 z-30">
                <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
                    <span className="text-xl font-extrabold text-slate-800">Swift<span className="text-teal-600">Partner</span></span>
                    <select 
                        className="bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 rounded-lg px-2 py-1.5 outline-none focus:ring-2 focus:ring-teal-500 max-w-[140px]"
                        value={selectedRestaurant?.id || ""}
                        onChange={(e) => {
                            if (e.target.value === "NEW") setIsCreating(true);
                            else setSelectedRestaurant(restaurants.find(r => r.id === e.target.value));
                        }}
                    >
                        {restaurants.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        <option value="NEW">+ Add New</option>
                    </select>
                </div>
                <div className="flex overflow-x-auto scrollbar-hide px-2">
                    {navItems.map((item) => (
                        <button key={item.name} onClick={() => setActiveTab(item.name)} className={`flex items-center gap-2 py-3 px-4 whitespace-nowrap font-bold text-sm transition-colors ${activeTab === item.name ? 'text-teal-600 border-b-2 border-teal-500' : 'text-slate-500 hover:text-teal-600'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} /></svg>
                            {item.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* DESKTOP SIDEBAR */}
            <aside className="w-56 bg-white border-r border-slate-100 flex-col hidden lg:flex shrink-0">
                <div className="h-20 flex items-center px-6 border-b border-slate-100 shrink-0">
                    <span className="text-2xl font-extrabold text-slate-800 tracking-tight">Swift<span className="text-teal-600">Partner</span></span>
                </div>
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block px-1">Active Restaurant</label>
                    <select 
                        className="w-full bg-white border border-slate-200 text-sm font-bold text-slate-800 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-teal-500 transition-shadow cursor-pointer truncate"
                        value={selectedRestaurant?.id || ""}
                        onChange={(e) => {
                            if (e.target.value === "NEW") setIsCreating(true);
                            else setSelectedRestaurant(restaurants.find(r => r.id === e.target.value));
                        }}
                    >
                        {restaurants.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        <option value="NEW">+ Add New Restaurant</option>
                    </select>
                </div>
                <div className="p-4 flex-1">
                    <div className="space-y-1">
                        {navItems.map((item) => (
                            <button key={item.name} onClick={() => setActiveTab(item.name)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${activeTab === item.name ? 'bg-teal-50 text-teal-700 shadow-sm border border-teal-100' : 'text-slate-500 hover:bg-slate-50 hover:text-teal-600'}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} /></svg>
                                {item.name}
                            </button>
                        ))}
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                <header className="h-20 bg-white border-b border-slate-100 hidden lg:flex items-center justify-between px-8 shrink-0">
                    <h1 className="text-2xl font-bold text-slate-800">{activeTab}</h1>
                    <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                        <span className={`text-sm font-bold px-3 transition-colors ${isAcceptingOrders ? 'text-slate-400' : 'text-red-500'}`}>Closed</span>
                        <button onClick={handleToggleStatus} className={`w-14 h-7 rounded-full transition-colors relative shadow-inner ${isAcceptingOrders ? 'bg-teal-500' : 'bg-slate-300'}`}>
                            <div className={`w-5 h-5 bg-white rounded-full absolute top-1 shadow transition-transform ${isAcceptingOrders ? 'translate-x-8' : 'translate-x-1'}`}></div>
                        </button>
                        <span className={`text-sm font-bold px-3 transition-colors ${isAcceptingOrders ? 'text-teal-600' : 'text-slate-400'}`}>Accepting</span>
                    </div>
                </header>
                
                <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50">
                    {activeTab === "Orders" && <VendorOrders activeRestaurantId={selectedRestaurant?.id} />}
                    {activeTab === "Menu" && <VendorMenu activeRestaurantId={selectedRestaurant?.id} />}
                    {activeTab === "Settings" && <VendorSettings activeRestaurantId={selectedRestaurant?.id} />}
                </div>
            </main>
        </div>
    );
}