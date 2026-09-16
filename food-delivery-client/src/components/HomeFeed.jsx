import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { fetchHomeData } from "../api/mockApi"; // NEW: Importing our API service

export default function HomeFeed({ setActiveRestaurantId }) {
    const { isVegOnly } = useCart();
    const [activeCategory, setActiveCategory] = useState("All");
    
    // NEW: API States
    const [isLoading, setIsLoading] = useState(true);
    const [feedData, setFeedData] = useState({ restaurants: [], categories: [], promotions: [], mockMenus: {} });

    // NEW: The Fetch Effect
    useEffect(() => {
        setIsLoading(true);
        fetchHomeData().then((data) => {
            setFeedData(data);
            setIsLoading(false);
        });
    }, []);

    const openRestaurants = feedData.restaurants.filter(rest => rest.isOpen);
    
    const categoryFilteredRestaurants = activeCategory === "All" 
        ? openRestaurants 
        : openRestaurants.filter(rest => rest.tags.some(tag => tag.toLowerCase() === activeCategory.toLowerCase()));

    const displayedRestaurants = isVegOnly 
        ? categoryFilteredRestaurants.filter(rest => {
            const restMenu = feedData.mockMenus[rest.id] || [];
            return restMenu.length > 0 && restMenu.every(item => item.isVeg === true);
        }) 
        : categoryFilteredRestaurants;

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            {/* Promotions Section */}
            <section className="mb-8">
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {isLoading 
                        ? [1, 2].map(n => <div key={n} className="flex-none w-[85vw] sm:w-[380px] h-44 rounded-3xl bg-slate-200 animate-pulse snap-start"></div>)
                        : feedData.promotions.map(promo => (
                            <div key={promo.id} className={`flex-none w-[85vw] sm:w-[380px] h-44 rounded-3xl p-6 flex flex-col justify-center snap-start relative overflow-hidden ${promo.bg} text-white shadow-md hover:shadow-lg transition-shadow`}>
                                <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
                                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>
                                <h3 className="text-3xl font-extrabold mb-1 relative z-10 tracking-tight">{promo.title}</h3>
                                <p className="text-white/90 font-medium relative z-10 text-sm">{promo.subtitle}</p>
                                <button className="mt-5 bg-white text-slate-800 text-sm font-bold py-2.5 px-5 rounded-full w-max shadow-sm hover:scale-105 active:scale-95 transition-transform relative z-10">Claim Now</button>
                            </div>
                        ))
                    }
                </div>
            </section>
            
            {/* Categories Section */}
            <section className="mb-10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-800">What are you craving?</h2>
                </div>
                <div className="flex gap-4 overflow-x-auto py-4 px-2 -mx-2 scrollbar-hide snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {isLoading 
                        ? [1, 2, 3, 4, 5, 6].map(n => (
                            <div key={n} className="flex flex-col items-center gap-2 min-w-[72px] snap-start">
                                <div className="w-16 h-16 rounded-2xl bg-slate-200 animate-pulse"></div>
                                <div className="w-12 h-3 rounded bg-slate-200 animate-pulse"></div>
                            </div>
                        ))
                        : feedData.categories.map(cat => (
                            <button key={cat.id} onClick={() => setActiveCategory(cat.name)} className="flex flex-col items-center gap-2 min-w-[72px] snap-start group outline-none">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 border ${activeCategory === cat.name ? 'bg-orange-50 border-orange-500 shadow-md shadow-orange-100 scale-105' : 'bg-white border-slate-100 shadow-sm group-hover:border-orange-500 group-hover:shadow-md'}`}>
                                    {cat.emoji}
                                </div>
                                <span className={`text-sm transition-colors duration-300 ${activeCategory === cat.name ? 'text-orange-600 font-bold' : 'text-slate-500 font-medium group-hover:text-orange-500'}`}>
                                    {cat.name}
                                </span>
                            </button>
                        ))
                    }
                </div>
            </section>

            {/* Restaurants Grid Section */}
            <section>
                <div className="flex justify-between items-end mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                        {isVegOnly && <span className="text-green-600 mr-2 text-base bg-green-50 px-2 py-1 rounded-md border border-green-100 uppercase tracking-wide font-extrabold flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>Pure Veg</span>}
                        {activeCategory === "All" ? "Popular Near You" : `${activeCategory} Places`}
                    </h2>
                </div>
                
                {isLoading ? (
                    /* The Restaurant Skeleton Grid */
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
                                <div key={rest.id} onClick={() => setActiveRestaurantId(rest.id)} className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                                    <div className="h-52 overflow-hidden relative">
                                        <img src={rest.image} alt={rest.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-xl font-bold text-slate-800 truncate max-w-[180px]">{rest.name}</h3>
                                                <div className="flex items-center gap-1 shrink-0">
                                                    {hasVeg && (
                                                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-600">
                                                            <rect x="1.5" y="1.5" width="13" height="13" stroke="currentColor" strokeWidth="1.5" rx="1"/>
                                                            <circle cx="8" cy="8" r="3.5" fill="currentColor"/>
                                                        </svg>
                                                    )}
                                                    {hasNonVeg && (
                                                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-700">
                                                            <rect x="1.5" y="1.5" width="13" height="13" stroke="currentColor" strokeWidth="1.5" rx="1"/>
                                                            <circle cx="8" cy="8" r="3.5" fill="currentColor"/>
                                                        </svg>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 shrink-0">
                                                <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                                <span className="text-sm font-bold text-slate-700">{rest.rating}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4 font-medium">
                                            {rest.tags.join(" • ")}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="w-full py-16 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 border-dashed">
                        <span className="text-5xl mb-4">🍽️</span>
                        <h3 className="text-lg font-bold text-slate-700 mb-1">No {isVegOnly && "Veg"} {activeCategory} places available</h3>
                        <p className="text-slate-500 text-sm">Try turning off the dietary filter or selecting a different category!</p>
                    </div>
                )}
            </section>
        </main>
    );
}