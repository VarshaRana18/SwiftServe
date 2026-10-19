import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { getCategoryEmoji } from "../utils/categoryEmojis";

export default function HomeFeed({ setActiveRestaurantId }) {
    const { isVegOnly } = useCart();
    const [activeCategory, setActiveCategory] = useState("All");

    // API States
    const [isLoading, setIsLoading] = useState(true);
    const [feedData, setFeedData] = useState({
        restaurants: [],
        categories: [],
        mockMenus: {}
    });

    // CONNECT TO BACKEND
    useEffect(() => {
        setIsLoading(true);

        fetch("http://localhost:5121/api/restaurant")
            .then(res => res.json())
            .then(apiRestaurants => {
                const menusDict = {};
                const uniqueCategories = new Set();

                // Map the C# backend data
                const mappedRestaurants = apiRestaurants.map(rest => {
                    // Extract menus and track unique categories
                    const items = rest.menuItems || [];
                    menusDict[rest.id] = items.map(item => {
                        if (item.category) uniqueCategories.add(item.category);
                        return { ...item, isVeg: item.dietaryPreference === 0 };
                    });

                    return {
                        id: rest.id,
                        name: rest.name,
                        address: rest.fullAddress || `${rest.city}, ${rest.pinCode}`,
                        isOpen: rest.isOpen !== false,
                        tags: rest.tags || [],
                        image: rest.imageUrl || null 
                    };
                });

                // Build dynamic categories array using the imported helper
                const dynamicCategories = [
                    { id: "all", name: "All", emoji: "🍽️" },
                    ...Array.from(uniqueCategories).map((cat, index) => ({
                        id: `cat-${index}`,
                        name: cat,
                        emoji: getCategoryEmoji(cat)
                    }))
                ];

                setFeedData({
                    restaurants: mappedRestaurants,
                    categories: dynamicCategories,
                    mockMenus: menusDict
                });
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Failed to connect to backend API:", error);
                setIsLoading(false);
            });
    }, []);

    // 1. Only show open restaurants that have AT LEAST ONE menu item
    const openRestaurants = feedData.restaurants.filter(rest => {
        const hasMenu = feedData.mockMenus[rest.id] && feedData.mockMenus[rest.id].length > 0;
        return rest.isOpen && hasMenu;
    });

    // 2. Filter based on actual menu categories
    const categoryFilteredRestaurants = activeCategory === "All"
        ? openRestaurants
        : openRestaurants.filter(rest => {
            const restMenu = feedData.mockMenus[rest.id] || [];
            return restMenu.some(item => item.category?.toLowerCase() === activeCategory.toLowerCase());
        });

    // 3. Apply Veg-Only filter
    const displayedRestaurants = isVegOnly
        ? categoryFilteredRestaurants.filter(rest => {
            const restMenu = feedData.mockMenus[rest.id] || [];
            return restMenu.length > 0 && restMenu.every(item => item.isVeg === true);
        })
        : categoryFilteredRestaurants;

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            {/* Categories Section */}
            <section className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-800">What are you craving?</h2>
                </div>
                
                <div className="flex gap-4 overflow-x-auto py-4 px-2 -mx-2 scrollbar-hide snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {isLoading ? (
                        [1, 2, 3, 4, 5, 6].map(n => (
                            <div key={n} className="flex flex-col items-center gap-2 min-w-[72px] snap-start">
                                <div className="w-16 h-16 rounded-2xl bg-slate-200 animate-pulse"></div>
                                <div className="w-12 h-3 rounded bg-slate-200 animate-pulse"></div>
                            </div>
                        ))
                    ) : (
                        feedData.categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.name)}
                                className="flex flex-col items-center gap-2 min-w-[72px] snap-start group outline-none"
                            >
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 border ${activeCategory === cat.name ? 'bg-orange-50 border-orange-500 shadow-md shadow-orange-100 scale-105' : 'bg-white border-slate-100 shadow-sm group-hover:border-orange-500 group-hover:shadow-md'}`}>
                                    {cat.emoji}
                                </div>
                                <span className={`text-sm transition-colors duration-300 ${activeCategory === cat.name ? 'text-orange-600 font-bold' : 'text-slate-500 font-medium group-hover:text-orange-500'}`}>
                                    {cat.name}
                                </span>
                            </button>
                        ))
                    )}
                </div>
            </section>

            {/* Restaurants Grid Section */}
            <section>
                <div className="flex justify-between items-end mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                        {isVegOnly && (
                            <span className="text-green-600 mr-2 text-base bg-green-50 px-2 py-1 rounded-md border border-green-100 uppercase tracking-wide font-extrabold flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                                Pure Veg
                            </span>
                        )}
                        {activeCategory === "All" ? "Popular Near You" : `${activeCategory} Places`}
                    </h2>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(n => (
                            <div key={n} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
                                <div className="h-52 bg-slate-200 animate-pulse"></div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-32 h-6 bg-slate-200 animate-pulse rounded-md"></div>
                                        <div className="w-12 h-6 bg-slate-200 animate-pulse rounded-md"></div>
                                    </div>
                                    <div className="w-48 h-4 bg-slate-100 animate-pulse rounded-md"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : displayedRestaurants.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedRestaurants.map(rest => {
                            const restMenu = feedData.mockMenus[rest.id] || [];
                            const hasVeg = restMenu.some(item => item.isVeg === true);
                            const hasNonVeg = restMenu.some(item => item.isVeg === false);

                            return (
                                <div 
                                    key={rest.id} 
                                    onClick={() => setActiveRestaurantId(rest.id)}
                                    className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                                >
                                    {/* FIX: Branded Initials Avatar Approach */}
                                    <div className="h-52 overflow-hidden relative bg-slate-100 flex flex-col items-center justify-center">
                                        {rest.image ? (
                                            <>
                                                <img src={rest.image} alt={rest.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                                            </>
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
                                                <span className="text-8xl font-black text-white/30 select-none shadow-sm">
                                                    {rest.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="p-5">
                                        <div className="flex justify-between items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-slate-800 truncate flex-1 pr-2">{rest.name}</h3>
                                            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 shrink-0">
                                                {hasVeg && (
                                                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-green-600">
                                                        <rect x="1.5" y="1.5" width="13" height="13" stroke="currentColor" strokeWidth="1.5" rx="1" />
                                                        <circle cx="8" cy="8" r="3.5" fill="currentColor" />
                                                    </svg>
                                                )}
                                                {hasNonVeg && (
                                                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-red-700">
                                                        <rect x="1.5" y="1.5" width="13" height="13" stroke="currentColor" strokeWidth="1.5" rx="1" />
                                                        <circle cx="8" cy="8" r="3.5" fill="currentColor" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                        {rest.tags && rest.tags.length > 0 && (
                                            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4 font-medium">
                                                {rest.tags.join(" • ")}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="w-full py-16 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 border-dashed">
                        <span className="text-5xl mb-4">🍽️</span>
                        <h3 className="text-lg font-bold text-slate-700 mb-1">
                            No {isVegOnly && "Veg "}{activeCategory !== "All" && activeCategory} places available
                        </h3>
                        <p className="text-slate-500 text-sm">Try turning off the dietary filter or selecting a different category!</p>
                    </div>
                )}
            </section>
        </main>
    );
}