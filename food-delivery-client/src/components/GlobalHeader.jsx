import { useState } from "react";
import { useCart } from "../context/CartContext";
import { restaurants } from "../data/mockData";

export default function GlobalHeader({ setActiveRestaurantId }) {
    const { setIsCartOpen, setActiveCartView, globalCarts } = useCart();
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const searchResults = searchQuery.trim() === "" ? [] : restaurants.filter(rest => 
        rest.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        rest.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveRestaurantId(null)}>
                        <div className="bg-orange-500 p-1.5 rounded-lg shadow-md shadow-orange-200">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <span className="text-xl font-extrabold text-slate-800 hidden sm:block">Swift<span className="text-orange-500">Serve</span></span>
                    </div>
                    {/* Location Pill... (Omitted long SVGs for brevity, keep your original HTML here) */}
                </div>

                <div className="flex-1 max-w-xl relative">
                    <div className="relative">
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => setIsSearchFocused(true)} onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)} placeholder="Search for restaurants, cuisines, or dishes..." className="w-full bg-slate-100 text-slate-800 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all border border-transparent focus:border-orange-500 shadow-inner" />
                    </div>
                    {isSearchFocused && searchQuery.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-fade-in max-h-80 overflow-y-auto">
                            {/* Search Results Overlay... (Keep your original HTML here) */}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={() => { setIsCartOpen(true); setActiveCartView(null); }} className="relative p-2 text-slate-600 hover:text-orange-500 transition-colors">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        {Object.keys(globalCarts).length > 0 && (
                            <span className="absolute top-1 right-1 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white rounded-full">
                                {Object.keys(globalCarts).length}
                            </span>
                        )}
                    </button>
                    <div className="w-10 h-10 bg-slate-200 rounded-full border-2 border-slate-200 overflow-hidden cursor-pointer hover:border-orange-500 transition-colors">
                        <img src="https://ui-avatars.com/api/?name=Customer&background=f97316&color=fff" alt="Profile" />
                    </div>
                </div>
            </div>
        </header>
    );
}