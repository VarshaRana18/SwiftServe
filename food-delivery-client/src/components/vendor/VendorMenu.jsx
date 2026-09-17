import { useState, useMemo } from "react";
import { mockMenus } from "../../data/mockData";

export default function VendorMenu() {
    const [inventory, setInventory] = useState(mockMenus[1] || []);
    const [menuSearch, setMenuSearch] = useState("");
    const [menuCategory, setMenuCategory] = useState("All");

    const menuCategories = useMemo(() => ["All", ...new Set(inventory.map(item => item.category))], [inventory]);

    const filteredInventory = useMemo(() => {
        return inventory.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase());
            const matchesCategory = menuCategory === "All" || item.category === menuCategory;
            return matchesSearch && matchesCategory;
        });
    }, [inventory, menuSearch, menuCategory]);

    const toggleItemAvailability = (itemId) => {
        setInventory(prev => prev.map(item => 
            item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
        ));
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col h-full">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 shrink-0">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <input type="text" placeholder="Search items..." value={menuSearch} onChange={(e) => setMenuSearch(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all font-medium text-sm" />
                        <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto scrollbar-hide pb-2 md:pb-0">
                        {menuCategories.map(cat => (
                            <button key={cat} onClick={() => setMenuCategory(cat)} className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors border ${menuCategory === cat ? 'bg-teal-50 border-teal-200 text-teal-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>{cat}</button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pb-20">
                {filteredInventory.length === 0 ? (
                    <div className="text-center text-slate-400 font-medium py-12">No items found.</div>
                ) : (
                    filteredInventory.map(item => (
                        <div key={item.id} className={`bg-white p-4 rounded-2xl shadow-sm border transition-all flex items-center justify-between gap-4 ${!item.isAvailable ? 'border-red-100 bg-red-50/30' : 'border-slate-100'}`}>
                            <div className="flex items-center gap-4 flex-1 overflow-hidden">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                                    {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className={`w-full h-full object-cover ${!item.isAvailable && 'grayscale opacity-50'}`} /> : <div className="w-full h-full flex items-center justify-center text-xl">🍔</div>}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className={`shrink-0 ${item.isVeg ? 'text-green-600' : 'text-red-700'}`}><rect x="1.5" y="1.5" width="13" height="13" stroke="currentColor" strokeWidth="1.5" rx="1"/><circle cx="8" cy="8" r="3.5" fill="currentColor"/></svg>
                                        <h3 className={`font-bold truncate text-sm sm:text-base ${!item.isAvailable ? 'text-slate-500' : 'text-slate-800'}`}>{item.name}</h3>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs sm:text-sm">
                                        <span className="font-extrabold text-slate-700">₹{item.price}</span><span className="text-slate-400">•</span><span className="font-medium text-slate-500 truncate">{item.category}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 shrink-0">
                                <span className={`text-[10px] sm:text-xs font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-md ${item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{item.isAvailable ? 'In Stock' : 'Out of Stock'}</span>
                                <button onClick={() => toggleItemAvailability(item.id)} className={`w-12 h-6 sm:w-14 sm:h-7 rounded-full transition-colors relative shadow-inner ${item.isAvailable ? 'bg-teal-500' : 'bg-slate-300'}`}>
                                    <div className={`w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full absolute top-1 shadow transition-transform ${item.isAvailable ? 'translate-x-7 sm:translate-x-8' : 'translate-x-1'}`}></div>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}