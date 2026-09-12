import { useState } from "react";

export default function CustomerHome() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [activeCategory, setActiveCategory] = useState("All");

    const [activeCartView, setActiveCartView] = useState(null); 
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    const [globalCarts, setGlobalCarts] = useState({
        "1": {
            restaurantId: 1,
            restaurantName: "Firehouse Grill",
            image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=100&auto=format&fit=crop",
            items: [
                { id: 101, name: "Classic Cheeseburger", price: 199, qty: 2 },
                { id: 102, name: "Large Fries", price: 99, qty: 1 }
            ]
        },
        "2": {
            restaurantId: 2,
            restaurantName: "Sakura Sushi",
            image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=100&auto=format&fit=crop",
            items: [
                { id: 201, name: "Spicy Tuna Roll", price: 349, qty: 1 }
            ]
        }
    });

    const updateQuantity = (restaurantId, itemId, delta) => {
        setGlobalCarts(prevCarts => {
            const targetCart = prevCarts[restaurantId];
            if (!targetCart) return prevCarts;

            const updatedItems = targetCart.items
                .map(item => item.id === itemId ? { ...item, qty: item.qty + delta } : item)
                .filter(item => item.qty > 0);

            if (updatedItems.length === 0) {
                const newCarts = { ...prevCarts };
                delete newCarts[restaurantId];
                if (activeCartView === restaurantId) setActiveCartView(null);
                if (Object.keys(newCarts).length === 0) setIsCartOpen(false);
                return newCarts;
            }

            return { ...prevCarts, [restaurantId]: { ...targetCart, items: updatedItems } };
        });
    };

    const deleteCart = (restaurantId) => {
        setGlobalCarts(prevCarts => {
            const newCarts = { ...prevCarts };
            delete newCarts[restaurantId];
            if (Object.keys(newCarts).length === 0) setIsCartOpen(false);
            return newCarts;
        });
        setConfirmDeleteId(null);
    };

    const categories = [
        { id: 0, name: "All", emoji: "🍽️" },
        { id: 1, name: "Pizza", emoji: "🍕" },
        { id: 2, name: "Burgers", emoji: "🍔" },
        { id: 3, name: "Sushi", emoji: "🍣" },
        { id: 4, name: "Healthy", emoji: "🥗" },
        { id: 5, name: "Desserts", emoji: "🍰" },
        { id: 6, name: "Coffee", emoji: "☕" },
        { id: 7, name: "Vegan", emoji: "🌱" },
    ];

    const promotions = [
        { id: 1, title: "50% OFF", subtitle: "On your first order", bg: "bg-gradient-to-r from-orange-500 to-red-500" },
        { id: 2, title: "Free Delivery", subtitle: "From top restaurants near you", bg: "bg-gradient-to-r from-teal-400 to-emerald-500" },
        { id: 3, title: "₹100 Cashback", subtitle: "When you pay with UPI", bg: "bg-gradient-to-r from-blue-500 to-indigo-500" }
    ];

    const restaurants = [
        { id: 1, name: "Firehouse Grill", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop", rating: 4.8, time: "25-35 min", fee: "Free Delivery", tags: ["Burgers", "American"], isOpen: true },
        { id: 2, name: "Sakura Sushi", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1000&auto=format&fit=crop", rating: 4.9, time: "40-50 min", fee: "₹49 Delivery", tags: ["Japanese", "Sushi"], isOpen: true },
        { id: 3, name: "Luigi's Oven", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop", rating: 4.6, time: "30-45 min", fee: "₹35 Delivery", tags: ["Pizza", "Italian"], isOpen: false }
    ];

    const openRestaurants = restaurants.filter(rest => rest.isOpen);
    const searchResults = searchQuery.trim() === "" ? [] : restaurants.filter(rest => 
        rest.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        rest.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const getCartTotal = (restaurantId) => globalCarts[restaurantId]?.items.reduce((total, item) => total + (item.price * item.qty), 0) || 0;
    const getGrandTotal = () => Object.values(globalCarts).reduce((grandTotal, cart) => grandTotal + cart.items.reduce((sum, item) => sum + (item.price * item.qty), 0), 0);

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* 1. THE GLOBAL HEADER */}
            <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="bg-orange-500 p-1.5 rounded-lg shadow-md shadow-orange-200">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <span className="text-xl font-extrabold text-slate-800 hidden sm:block">Swift<span className="text-orange-500">Serve</span></span>
                        </div>
                        <button className="hidden md:flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-4 py-2.5 rounded-full transition-all active:scale-95">
                            <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            <div className="flex flex-col items-start">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">Delivering To</span>
                                <span className="text-sm font-semibold text-slate-700 leading-none">Home - Vadodara</span>
                            </div>
                            <svg className="w-4 h-4 text-slate-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </button>
                    </div>

                    <div className="flex-1 max-w-xl relative">
                        <div className="relative">
                            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => setIsSearchFocused(true)} onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)} placeholder="Search for restaurants, cuisines, or dishes..." className="w-full bg-slate-100 text-slate-800 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all border border-transparent focus:border-orange-500 shadow-inner" />
                            <svg className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        {isSearchFocused && searchQuery.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-fade-in max-h-80 overflow-y-auto">
                                <div className="p-2">
                                    <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Restaurants & Cuisines</div>
                                    {searchResults.length > 0 ? (
                                        searchResults.map(result => (
                                            <button key={result.id} className="w-full text-left px-3 py-3 hover:bg-slate-50 rounded-lg flex items-center justify-between transition-colors">
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

            {/* MAIN CONTENT */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <section className="mb-8">
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {promotions.map(promo => (
                            <div key={promo.id} className={`flex-none w-[85vw] sm:w-[380px] h-44 rounded-3xl p-6 flex flex-col justify-center snap-start relative overflow-hidden ${promo.bg} text-white shadow-md hover:shadow-lg transition-shadow`}>
                                <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div><div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>
                                <h3 className="text-3xl font-extrabold mb-1 relative z-10 tracking-tight">{promo.title}</h3><p className="text-white/90 font-medium relative z-10 text-sm">{promo.subtitle}</p>
                                <button className="mt-5 bg-white text-slate-800 text-sm font-bold py-2.5 px-5 rounded-full w-max shadow-sm hover:scale-105 active:scale-95 transition-transform relative z-10">Claim Now</button>
                            </div>
                        ))}
                    </div>
                </section>
                <section className="mb-10">
                    <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-bold text-slate-800">What are you craving?</h2></div>
                    <div className="flex gap-4 overflow-x-auto py-4 px-2 -mx-2 scrollbar-hide snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {categories.map(cat => (
                            <button key={cat.id} onClick={() => setActiveCategory(cat.name)} className="flex flex-col items-center gap-2 min-w-[72px] snap-start group outline-none">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 border ${activeCategory === cat.name ? 'bg-orange-50 border-orange-500 shadow-md shadow-orange-100 scale-105' : 'bg-white border-slate-100 shadow-sm group-hover:border-orange-500 group-hover:shadow-md'}`}>{cat.emoji}</div>
                                <span className={`text-sm transition-colors duration-300 ${activeCategory === cat.name ? 'text-orange-600 font-bold' : 'text-slate-500 font-medium group-hover:text-orange-500'}`}>{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </section>
                <section>
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Popular Near You</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {openRestaurants.map(rest => (
                            <div key={rest.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                                <div className="h-52 overflow-hidden relative">
                                    <img src={rest.image} alt={rest.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-slate-800">{rest.name}</h3>
                                        <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100"><svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg><span className="text-sm font-bold text-slate-700">{rest.rating}</span></div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4 font-medium">
                                        {rest.tags.map((tag, index) => <span key={tag}>{tag} {index < rest.tags.length - 1 && <span className="text-slate-300 mx-1">•</span>}</span>)}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-semibold">
                                        <div className="flex items-center gap-1.5 bg-slate-100/70 text-slate-700 px-3 py-1.5 rounded-md"><svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{rest.time}</div>
                                        <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-md border border-green-100"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>{rest.fee}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* 4. THE DYNAMIC CART DRAWER */}
            <div className={`fixed inset-0 z-50 flex justify-end overflow-hidden ${isCartOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                
                {/* Backdrop */}
                <div 
                    className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ease-out ${isCartOpen ? 'opacity-100' : 'opacity-0'}`} 
                    onClick={() => setIsCartOpen(false)}
                ></div>
                
                {/* Sliding Drawer container */}
                <div className={`relative w-full max-w-md bg-slate-50 h-full shadow-2xl flex flex-col transition-transform duration-300 ease-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    
                    {/* VIEW A: THE CART HUB (Overview) */}
                    {activeCartView === null && (
                        <>
                            <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">Your Carts</h2>
                                    <p className="text-sm text-slate-500">{Object.keys(globalCarts).length} Active Orders</p>
                                </div>
                                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {Object.keys(globalCarts).length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                        <svg className="w-24 h-24 mb-4 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                        <p className="text-lg font-medium text-slate-500">Your carts are empty</p>
                                    </div>
                                ) : (
                                    Object.entries(globalCarts).map(([id, cart]) => (
                                        <div key={id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group">
                                            <div className="flex items-center gap-4">
                                                <img src={cart.image} alt={cart.restaurantName} className="w-14 h-14 rounded-xl object-cover" />
                                                <div>
                                                    <h3 className="font-bold text-slate-800">{cart.restaurantName}</h3>
                                                    <p className="text-sm text-slate-500">{cart.items.reduce((sum, i) => sum + i.qty, 0)} Items • ₹{getCartTotal(id)}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-2">
                                                {confirmDeleteId === id ? (
                                                    <div className="flex items-center gap-1.5 bg-red-50 p-1 rounded-xl">
                                                        <span className="text-[11px] font-bold text-red-600 px-2 uppercase tracking-wide">Delete?</span>
                                                        <button onClick={() => deleteCart(id)} className="bg-red-500 text-white p-1.5 rounded-lg hover:bg-red-600 transition-colors shadow-sm">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                        </button>
                                                        <button onClick={() => setConfirmDeleteId(null)} className="bg-white text-slate-500 p-1.5 rounded-lg shadow-sm border border-slate-200 hover:text-slate-700 transition-colors">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <button onClick={() => setActiveCartView(id)} className="bg-orange-50 text-orange-600 font-bold px-4 py-2 rounded-xl text-sm hover:bg-orange-100 transition-colors">
                                                            View
                                                        </button>
                                                        <button onClick={() => setConfirmDeleteId(id)} className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {Object.keys(globalCarts).length > 0 && (
                                <div className="p-6 bg-white border-t border-slate-100 shrink-0">
                                    <button className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-colors shadow-lg active:scale-95 flex items-center justify-between px-6">
                                        <span>Checkout All</span>
                                        <span>₹{getGrandTotal()}</span>
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {/* VIEW B: THE CART DETAIL (Specific Restaurant) */}
                    {activeCartView !== null && globalCarts[activeCartView] && (
                        <>
                            <div className="p-6 bg-white border-b border-slate-100 flex items-center gap-4 shrink-0 shadow-sm z-10">
                                <button onClick={() => setActiveCartView(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                </button>
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-slate-800 line-clamp-1">{globalCarts[activeCartView].restaurantName}</h2>
                                    <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide">Review Order</p>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {globalCarts[activeCartView].items.map(item => (
                                    <div key={item.id} className="flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-slate-800">{item.name}</h4>
                                            <p className="text-slate-500 text-sm mt-1">₹{item.price}</p>
                                        </div>
                                        <div className="flex items-center gap-3 bg-slate-100 rounded-lg p-1">
                                            <button 
                                                onClick={() => updateQuantity(activeCartView, item.id, -1)}
                                                className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors font-bold shadow-sm ${item.qty === 1 ? 'text-red-500 hover:bg-red-50' : 'text-slate-600 hover:bg-white'}`}
                                            >
                                                {item.qty === 1 ? (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                ) : (
                                                    "-"
                                                )}
                                            </button>
                                            <span className="font-bold text-sm w-4 text-center">{item.qty}</span>
                                            <button 
                                                onClick={() => updateQuantity(activeCartView, item.id, 1)}
                                                className="w-8 h-8 flex items-center justify-center text-orange-500 hover:bg-white rounded-md transition-colors font-bold shadow-sm"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                
                                <div className="pt-6 border-t border-dashed border-slate-200">
                                    <div className="flex justify-between text-sm text-slate-500 mb-2">
                                        <span>Subtotal</span>
                                        <span>₹{getCartTotal(activeCartView)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-slate-500">
                                        <span>Platform Fee</span>
                                        <span>₹10</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-white border-t border-slate-100 shrink-0">
                                <button className="w-full bg-orange-500 text-white font-bold py-4 rounded-2xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200 active:scale-95 flex items-center justify-between px-6">
                                    <span>Checkout</span>
                                    <span>₹{getCartTotal(activeCartView) + 10}</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}