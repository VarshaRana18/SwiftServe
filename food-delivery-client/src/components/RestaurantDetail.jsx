import { useMemo } from "react";
import { restaurants, mockMenus } from "../data/mockData";
import { useCart } from "../context/CartContext";

export default function RestaurantDetail({ activeRestaurantId, setActiveRestaurantId }) {
    const { updateQuantity, addToCart, getItemQtyInCart } = useCart();
    
    const activeRest = restaurants.find(r => r.id === activeRestaurantId);
    const menuItems = mockMenus[activeRestaurantId] || [];

    const activeMenuCategories = useMemo(() => {
        if (!activeRestaurantId || !mockMenus[activeRestaurantId]) return [];
        return [...new Set(menuItems.map(item => item.category))];
    }, [activeRestaurantId, menuItems]);

    return (
        <div className="animate-slide-in-right pb-32">
            <div className="relative h-64 md:h-80 w-full bg-slate-900">
                <img src={activeRest.image} alt={activeRest.name} className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                
                <button onClick={() => setActiveRestaurantId(null)} className="absolute top-6 left-4 sm:left-8 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </button>

                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 max-w-7xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">{activeRest.name}</h1>
                    <p className="text-slate-300 text-sm md:text-base mb-4 max-w-2xl">{activeRest.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-white">
                        <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg"><svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>{activeRest.rating}</div>
                        <div className="flex items-center gap-1.5"><svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{activeRest.time}</div>
                        <div className="flex items-center gap-1.5"><svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>{activeRest.address}</div>
                    </div>
                </div>
            </div>

            <div className="sticky top-20 z-30 bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-6 overflow-x-auto py-4 scrollbar-hide text-sm font-bold text-slate-500">
                        {activeMenuCategories.map((cat, idx) => (
                            <button key={cat} className={`whitespace-nowrap transition-colors hover:text-orange-500 ${idx === 0 ? 'text-orange-500 border-b-2 border-orange-500 pb-1' : ''}`}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
                {activeMenuCategories.map(category => (
                    <div key={category} id={category}>
                        <h3 className="text-2xl font-bold text-slate-800 mb-6">{category}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {menuItems.filter(item => item.category === category).map(item => {
                                const qtyInCart = getItemQtyInCart(activeRestaurantId, item.id);
                                const hitStockLimit = item.stockQuantity !== null && qtyInCart >= item.stockQuantity;
                                
                                return (
                                    <div key={item.id} className={`bg-white rounded-2xl p-4 border flex gap-4 transition-all ${!item.isAvailable ? 'opacity-60 grayscale border-slate-100' : 'border-slate-200 hover:shadow-md hover:border-orange-200'}`}>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1"><h4 className="text-lg font-bold text-slate-800">{item.name}</h4></div>
                                            <p className="text-lg font-semibold text-slate-700 mb-2">₹{item.price}</p>
                                            <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{item.description}</p>
                                        </div>
                                        <div className="w-32 flex flex-col items-center justify-between shrink-0">
                                            <div className="w-full h-24 bg-slate-100 rounded-xl overflow-hidden mb-3 shadow-sm border border-slate-100">
                                                {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><span className="text-3xl">🍽️</span></div>}
                                            </div>
                                            {!item.isAvailable ? (
                                                <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded uppercase tracking-wider text-center w-full">Unavailable</span>
                                            ) : qtyInCart > 0 ? (
                                                <div className="flex items-center justify-between bg-orange-50 rounded-lg p-1 w-full border border-orange-200">
                                                    <button onClick={() => updateQuantity(activeRestaurantId, item.id, -1)} className="w-7 h-7 flex items-center justify-center text-orange-600 bg-white rounded-md shadow-sm font-bold">-</button>
                                                    <span className="font-bold text-sm text-orange-700">{qtyInCart}</span>
                                                    <button onClick={() => updateQuantity(activeRestaurantId, item.id, 1)} disabled={hitStockLimit} className={`w-7 h-7 flex items-center justify-center rounded-md font-bold transition-all ${hitStockLimit ? 'text-slate-300 bg-slate-100 cursor-not-allowed' : 'text-orange-600 bg-white shadow-sm hover:bg-orange-500 hover:text-white'}`}>+</button>
                                                </div>
                                            ) : (
                                                <button onClick={() => addToCart(activeRestaurantId, item)} className="w-full bg-white text-orange-600 font-bold py-1.5 rounded-lg border-2 border-slate-200 hover:border-orange-500 hover:bg-orange-50 transition-all shadow-sm">ADD</button>
                                            )}
                                            {hitStockLimit && qtyInCart > 0 && <span className="text-[10px] text-red-500 mt-1 font-semibold text-center leading-none">Max Stock Reached</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}