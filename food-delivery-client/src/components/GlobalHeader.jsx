import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { restaurants } from "../data/mockData";

export default function GlobalHeader({ setActiveRestaurantId }) {
    const { setIsCartOpen, setActiveCartView, globalCarts, setIsOrdersOpen } = useCart();

    // Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);

    // Location Modal State
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [activeLocation, setActiveLocation] = useState("Home - Vadodara");

    // NEW: Profile Menu State
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const searchResults = searchQuery.trim() === "" ? [] : restaurants.filter(rest =>
        rest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rest.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    useEffect(() => {
        setFocusedIndex(-1);
    }, [searchQuery]);

    const handleKeyDown = (e) => {
        if (!isSearchFocused || searchResults.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setFocusedIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : prev));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setFocusedIndex(prev => (prev > -1 ? prev - 1 : prev));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (focusedIndex >= 0 && searchResults[focusedIndex]) {
                setActiveRestaurantId(searchResults[focusedIndex].id);
                setSearchQuery("");
                e.target.blur();
            }
        }
    };

    return (
        <>
            <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">

                    {/* Logo & Location */}
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveRestaurantId(null)}>
                            <div className="bg-orange-500 p-1.5 rounded-lg shadow-md shadow-orange-200">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <span className="text-xl font-extrabold text-slate-800 hidden sm:block">Swift<span className="text-orange-500">Serve</span></span>
                        </div>

                        <button onClick={() => setIsLocationModalOpen(true)} className="hidden md:flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-4 py-2.5 rounded-full transition-all active:scale-95">
                            <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            <div className="flex flex-col items-start">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">Delivering To</span>
                                <span className="text-sm font-semibold text-slate-700 leading-none truncate max-w-[140px]">{activeLocation}</span>
                            </div>
                            <svg className={`w-4 h-4 text-slate-400 ml-1 transition-transform ${isLocationModalOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-xl relative">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                                onKeyDown={handleKeyDown}
                                placeholder="Search for restaurants, cuisines, or dishes..."
                                className="w-full bg-slate-100 text-slate-800 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all border border-transparent focus:border-orange-500 shadow-inner"
                            />
                            <svg className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>

                        {isSearchFocused && searchQuery.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-fade-in max-h-80 overflow-y-auto">
                                <div className="p-2">
                                    <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Restaurants & Cuisines</div>
                                    {searchResults.length > 0 ? (
                                        searchResults.map((result, index) => (
                                            <button
                                                key={result.id}
                                                onClick={() => { setActiveRestaurantId(result.id); setSearchQuery(""); }}
                                                className={`w-full text-left px-3 py-3 rounded-lg flex items-center justify-between transition-colors ${focusedIndex === index ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0"><img src={result.image} alt={result.name} className={`w-full h-full object-cover ${!result.isOpen ? 'grayscale' : ''}`} /></div>
                                                    <div className="flex flex-col"><span className={`font-medium ${!result.isOpen ? 'text-slate-400' : 'text-slate-700'}`}>{result.name}</span><span className="text-xs text-slate-400">{result.tags.join(", ")}</span></div>
                                                </div>
                                                {!result.isOpen && <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md uppercase tracking-wide">Closed</span>}
                                            </button>
                                        ))
                                    ) : <div className="px-3 py-4 text-center text-sm text-slate-500">No results found for "{searchQuery}"</div>}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Cart & Profile Controls */}
                    <div className="flex items-center gap-4 relative">
                        <button onClick={() => { setIsCartOpen(true); setActiveCartView(null); }} className="relative p-2 text-slate-600 hover:text-orange-500 transition-colors">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                            {Object.keys(globalCarts).length > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white rounded-full">{Object.keys(globalCarts).length}</span>
                            )}
                        </button>

                        {/* Profile Avatar Button */}
                        <div
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="w-10 h-10 bg-slate-200 rounded-full border-2 border-slate-200 overflow-hidden cursor-pointer hover:border-orange-500 transition-colors"
                        >
                            <img src="https://ui-avatars.com/api/?name=Samiul+Shaikh&background=f97316&color=fff&bold=true" alt="Profile" />
                        </div>

                        {/* NEW: Profile Dropdown Menu */}
                        {isProfileOpen && (
                            <>
                                {/* Invisible Backdrop to catch clicks outside the menu */}
                                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>

                                <div className="absolute top-full right-0 mt-4 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-slide-up">
                                    {/* The Identity Header */}
                                    <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                                            <img src="https://ui-avatars.com/api/?name=Samiul+Shaikh&background=f97316&color=fff&bold=true" alt="Profile" />
                                        </div>
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="font-bold text-slate-800 truncate">Samiul Shaikh</span>
                                            <span className="text-xs text-slate-500 truncate">samiul@example.com</span>
                                        </div>
                                    </div>

                                    {/* MVP Actions */}
                                    <div className="p-2">
                                        <button
                                            onClick={() => {
                                                setIsOrdersOpen(true); // NEW: Opens the Orders Drawer
                                                setIsProfileOpen(false); // Closes the profile dropdown
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-700 hover:bg-slate-50 hover:text-orange-500 rounded-xl transition-colors font-medium text-sm text-left"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                            Track Orders
                                        </button>
                                        <button
                                            onClick={() => { alert("Navigating to Settings..."); setIsProfileOpen(false); }}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-700 hover:bg-slate-50 hover:text-orange-500 rounded-xl transition-colors font-medium text-sm text-left"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            Settings
                                        </button>
                                    </div>

                                    <div className="border-t border-slate-100 p-2">
                                        <button
                                            onClick={() => { alert("Logging out..."); setIsProfileOpen(false); }}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium text-sm text-left"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                            Log Out
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* THE LOCATION MODAL */}
            {isLocationModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-fade-in" onClick={() => setIsLocationModalOpen(false)}></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-800">Select Delivery Location</h2>
                            <button onClick={() => setIsLocationModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="relative">
                                <input type="text" placeholder="Search for your area or apartment..." className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all font-medium" />
                                <svg className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>

                            <button onClick={() => { setActiveLocation("Current Location"); setIsLocationModalOpen(false); }} className="w-full flex items-center gap-4 p-4 rounded-2xl bg-orange-50/50 hover:bg-orange-50 transition-colors border border-orange-100 group text-left">
                                <div className="bg-orange-100 text-orange-500 p-2.5 rounded-xl group-hover:scale-110 transition-transform"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><circle cx="12" cy="12" r="3" /></svg></div>
                                <div className="flex flex-col"><span className="font-bold text-orange-600">Use Current Location</span><span className="text-xs text-orange-500/80 font-medium">Vadodara, Gujarat</span></div>
                            </button>

                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Saved Addresses</h3>
                                <div className="space-y-2">
                                    {[
                                        { title: "Home", address: "123 Main St, Vadodara", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
                                        { title: "Work", address: "Tech Park, Vadodara", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }
                                    ].map((loc) => (
                                        <button key={loc.title} onClick={() => { setActiveLocation(`${loc.title} - Vadodara`); setIsLocationModalOpen(false); }} className="w-full flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100 text-left">
                                            <div className="bg-slate-100 p-2.5 rounded-xl text-slate-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={loc.icon} /></svg></div>
                                            <div className="flex flex-col"><span className="font-semibold text-slate-700">{loc.title}</span><span className="text-xs text-slate-400">{loc.address}</span></div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}