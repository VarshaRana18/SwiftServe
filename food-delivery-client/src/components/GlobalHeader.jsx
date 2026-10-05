import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { restaurants, mockMenus } from "../data/mockData";
import LocationModal from "./LocationModal";

export default function GlobalHeader({ setActiveRestaurantId }) {
    const { 
        setIsCartOpen, setActiveCartView, globalCarts, 
        setIsOrdersOpen, setIsSettingsOpen,
        isLocationModalOpen, setIsLocationModalOpen, // IMPORTED FROM CONTEXT
        activeLocation, setActiveLocation            // IMPORTED FROM CONTEXT
    } = useCart();
    
    // Real User State
    const [realUser, setRealUser] = useState({ name: "User", email: "" });

    // Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    
    // Profile Menu State
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Decode JWT on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                
                const payload = JSON.parse(jsonPayload);
                const emailClaim = payload.email || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || "No Email";
                const nameClaim = payload.fullName || payload.name || payload.unique_name || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || emailClaim.split('@')[0];

                setRealUser({ name: nameClaim, email: emailClaim });
            } catch (e) {
                console.error("Failed to decode token in header.");
            }
        }
    }, []);

    const searchResults = searchQuery.trim() === "" ? [] : restaurants.reduce((acc, rest) => {
        const query = searchQuery.toLowerCase();
        const matchesNameOrTag = rest.name.toLowerCase().includes(query) || rest.tags.some(tag => tag.toLowerCase().includes(query));
        const restMenu = mockMenus[rest.id] || [];
        const matchingItems = restMenu.filter(item => item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query));
        
        if (matchesNameOrTag || matchingItems.length > 0) {
            acc.push({
                ...rest,
                matchReason: !matchesNameOrTag && matchingItems.length > 0 ? `Matches: ${matchingItems[0].name}` : null
            });
        }
        return acc;
    }, []);

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
                                                onClick={() => {
                                                    setActiveRestaurantId(result.id);
                                                    setSearchQuery("");
                                                }}
                                                className={`w-full text-left px-3 py-3 rounded-lg flex items-center justify-between transition-colors ${focusedIndex === index ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                                                        <img src={result.image} alt={result.name} className={`w-full h-full object-cover ${!result.isOpen ? 'grayscale' : ''}`} />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className={`font-medium ${!result.isOpen ? 'text-slate-400' : 'text-slate-700'}`}>{result.name}</span>
                                                        <span className="text-xs text-slate-400">
                                                            {result.matchReason ? (
                                                                <span className="text-orange-500 font-semibold">{result.matchReason}</span>
                                                            ) : (
                                                                result.tags.join(", ")
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                                {!result.isOpen && <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md uppercase tracking-wide">Closed</span>}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-3 py-4 text-center text-sm text-slate-500">No results found for "{searchQuery}"</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Cart & Profile Controls */}
                    <div className="flex items-center gap-4 relative">
                        <button onClick={() => { setIsCartOpen(true); setActiveCartView(null); }} className="relative p-2 text-slate-600 hover:text-orange-500 transition-colors">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                            {Object.keys(globalCarts).length > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white rounded-full">
                                    {Object.keys(globalCarts).length}
                                </span>
                            )}
                        </button>
                        
                        <div onClick={() => setIsProfileOpen(!isProfileOpen)} className="w-10 h-10 bg-slate-200 rounded-full border-2 border-slate-200 overflow-hidden cursor-pointer hover:border-orange-500 transition-colors">
                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(realUser.name)}&background=f97316&color=fff&bold=true`} alt="Profile" />
                        </div>

                        {isProfileOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                                <div className="absolute top-full right-0 mt-4 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-slide-up">
                                    <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(realUser.name)}&background=f97316&color=fff&bold=true`} alt="Profile" />
                                        </div>
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="font-bold text-slate-800 truncate">{realUser.name}</span>
                                            <span className="text-xs text-slate-500 truncate">{realUser.email}</span>
                                        </div>
                                    </div>
                                    <div className="p-2">
                                        <button onClick={() => { setIsOrdersOpen(true); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-700 hover:bg-slate-50 hover:text-orange-500 rounded-xl transition-colors font-medium text-sm text-left">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                            Track Orders
                                        </button>
                                        <button onClick={() => { setIsSettingsOpen(true); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-700 hover:bg-slate-50 hover:text-orange-500 rounded-xl transition-colors font-medium text-sm text-left">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c-.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c.94-1.543-.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            Settings
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Location Modal */}
            <LocationModal 
                isOpen={isLocationModalOpen} 
                onClose={() => setIsLocationModalOpen(false)} 
                setActiveLocation={setActiveLocation}
            />
        </>
    );
}