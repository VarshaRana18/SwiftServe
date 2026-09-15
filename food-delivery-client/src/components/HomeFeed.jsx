import { useState } from "react";
import { categories, promotions, restaurants } from "../data/mockData";

export default function HomeFeed({ setActiveRestaurantId }) {
    const [activeCategory, setActiveCategory] = useState("All");
    
    // 1. Get all open restaurants first
    const openRestaurants = restaurants.filter(rest => rest.isOpen);

    // 2. NEW: Filter them down based on the active category tag
    const displayedRestaurants = activeCategory === "All" 
        ? openRestaurants 
        : openRestaurants.filter(rest => 
            rest.tags.some(tag => tag.toLowerCase() === activeCategory.toLowerCase())
        );

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <section className="mb-8">
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {promotions.map(promo => (
                        <div key={promo.id} className={`flex-none w-[85vw] sm:w-[380px] h-44 rounded-3xl p-6 flex flex-col justify-center snap-start relative overflow-hidden ${promo.bg} text-white shadow-md hover:shadow-lg transition-shadow`}>
                            <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
                            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>
                            <h3 className="text-3xl font-extrabold mb-1 relative z-10 tracking-tight">{promo.title}</h3>
                            <p className="text-white/90 font-medium relative z-10 text-sm">{promo.subtitle}</p>
                            <button className="mt-5 bg-white text-slate-800 text-sm font-bold py-2.5 px-5 rounded-full w-max shadow-sm hover:scale-105 active:scale-95 transition-transform relative z-10">Claim Now</button>
                        </div>
                    ))}
                </div>
            </section>
            
            <section className="mb-10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-800">What are you craving?</h2>
                </div>
                <div className="flex gap-4 overflow-x-auto py-4 px-2 -mx-2 scrollbar-hide snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {categories.map(cat => (
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
                    ))}
                </div>
            </section>

            <section>
                <div className="flex justify-between items-end mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">
                        {activeCategory === "All" ? "Popular Near You" : `${activeCategory} Places`}
                    </h2>
                </div>
                
                {/* 3. NEW: Map over displayedRestaurants instead of openRestaurants */}
                {displayedRestaurants.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedRestaurants.map(rest => (
                            <div key={rest.id} onClick={() => setActiveRestaurantId(rest.id)} className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                                <div className="h-52 overflow-hidden relative">
                                    <img src={rest.image} alt={rest.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-slate-800">{rest.name}</h3>
                                        <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                                            <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                            <span className="text-sm font-bold text-slate-700">{rest.rating}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4 font-medium">
                                        {rest.tags.join(" • ")}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="w-full py-16 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 border-dashed">
                        <span className="text-5xl mb-4">🍽️</span>
                        <h3 className="text-lg font-bold text-slate-700 mb-1">No {activeCategory} places open</h3>
                        <p className="text-slate-500 text-sm">Try selecting a different category!</p>
                    </div>
                )}
            </section>
        </main>
    );
}