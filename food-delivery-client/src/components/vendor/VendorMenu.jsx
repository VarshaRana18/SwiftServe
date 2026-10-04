import { useState, useMemo, useEffect } from "react";

export default function VendorMenu({ activeRestaurantId }) {
    const [inventory, setInventory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [menuSearch, setMenuSearch] = useState("");
    const [menuCategory, setMenuCategory] = useState("All");
    
    // Add Item Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [newItem, setNewItem] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        dietaryPreference: "0" // 0 = Veg, 1 = Non-Veg
    });

    useEffect(() => {
        if (!activeRestaurantId) return;

        const fetchMenu = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`http://localhost:5121/api/menuitem/${activeRestaurantId}`);
                if (response.ok) {
                    const data = await response.json();
                    setInventory(data);
                }
            } catch (error) {
                console.error("Failed to fetch menu items.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMenu();
    }, [activeRestaurantId]);

    const menuCategories = useMemo(() => ["All", ...new Set(inventory.map(item => item.category).filter(Boolean))], [inventory]);

    const filteredInventory = useMemo(() => {
        return inventory.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase());
            const matchesCategory = menuCategory === "All" || item.category === menuCategory;
            return matchesSearch && matchesCategory;
        });
    }, [inventory, menuSearch, menuCategory]);

    const toggleItemAvailability = async (itemId) => {
        setInventory(prev => prev.map(item => item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item));
        
        // TODO: Wire to Varsha's upcoming PUT /api/menuitem/{id}/availability endpoint
        /*
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:5121/api/menuitem/${itemId}/availability`, {
            method: "PUT",
            headers: { 'Authorization': `Bearer ${token}` }
        });
        */
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        setIsAdding(true);
        const token = localStorage.getItem('token');

        try {
            const response = await fetch("http://localhost:5121/api/menuitem", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    name: newItem.name,
                    description: newItem.description,
                    price: parseFloat(newItem.price),
                    category: newItem.category,
                    dietaryPreference: parseInt(newItem.dietaryPreference),
                    restaurantId: activeRestaurantId
                })
            });

            if (response.ok) {
                const addedItem = await response.json();
                
                // Manually add the isAvailable flag for the UI if the backend doesn't return it yet
                if (addedItem.isAvailable === undefined) {
                    addedItem.isAvailable = true;
                }

                setInventory(prev => [...prev, addedItem]);
                setIsAddModalOpen(false);
                setNewItem({ name: "", description: "", price: "", category: "", dietaryPreference: "0" });
            } else {
                console.error("Failed to add menu item");
            }
        } catch (error) {
            console.error("Network error");
        } finally {
            setIsAdding(false);
        }
    };

    if (isLoading) {
        return <div className="flex h-full items-center justify-center text-slate-500 font-bold">Loading Menu...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto flex flex-col h-full relative">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 shrink-0">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="flex w-full md:w-auto gap-3 flex-1">
                        <div className="relative flex-1 md:w-96">
                            <input type="text" placeholder="Search items..." value={menuSearch} onChange={(e) => setMenuSearch(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all font-medium text-sm" />
                            <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <button onClick={() => setIsAddModalOpen(true)} className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm shrink-0 whitespace-nowrap">
                            + Add Item
                        </button>
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
                    <div className="text-center text-slate-400 font-medium py-12">No items found. Click "+ Add Item" to add your first menu item.</div>
                ) : (
                    filteredInventory.map(item => (
                        <div key={item.id} className={`bg-white p-4 rounded-2xl shadow-sm border transition-all flex items-center justify-between gap-4 ${!item.isAvailable ? 'border-red-100 bg-red-50/30' : 'border-slate-100'}`}>
                            <div className="flex items-center gap-4 flex-1 overflow-hidden">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                                    {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className={`w-full h-full object-cover ${!item.isAvailable && 'grayscale opacity-50'}`} /> : <div className="w-full h-full flex items-center justify-center text-xl">🍽️</div>}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className={`shrink-0 ${item.dietaryPreference === 0 ? 'text-green-600' : 'text-red-700'}`}>
                                            <rect x="1.5" y="1.5" width="13" height="13" stroke="currentColor" strokeWidth="1.5" rx="1" />
                                            <circle cx="8" cy="8" r="3.5" fill="currentColor" />
                                        </svg>
                                        <h3 className={`font-bold truncate text-sm sm:text-base ${!item.isAvailable ? 'text-slate-500' : 'text-slate-800'}`}>{item.name}</h3>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs sm:text-sm">
                                        <span className="font-extrabold text-slate-700">₹{item.price}</span>
                                        <span className="text-slate-400">•</span>
                                        <span className="font-medium text-slate-500 truncate">{item.category || "General"}</span>
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

            {/* Add Menu Item Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
                    <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <h2 className="text-lg font-bold text-slate-800">Add New Item</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <form onSubmit={handleAddItem} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Item Name</label>
                                <input type="text" required value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-slate-50 focus:bg-white" placeholder="e.g. Masala Dosa" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                                <textarea required value={newItem.description} onChange={(e) => setNewItem({...newItem, description: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-slate-50 focus:bg-white resize-none" rows="2" placeholder="Describe the item..." />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Price (₹)</label>
                                    <input type="number" step="0.01" required min="0" value={newItem.price} onChange={(e) => setNewItem({...newItem, price: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-slate-50 focus:bg-white" placeholder="120.00" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                                    <input type="text" required value={newItem.category} onChange={(e) => setNewItem({...newItem, category: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-slate-50 focus:bg-white" placeholder="e.g. Dosa" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Dietary Preference</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="dietary" value="0" checked={newItem.dietaryPreference === "0"} onChange={(e) => setNewItem({...newItem, dietaryPreference: e.target.value})} className="text-teal-600 focus:ring-teal-500" />
                                        <span className="text-sm font-medium text-slate-700 flex items-center gap-1">
                                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-green-600"><rect x="1.5" y="1.5" width="13" height="13" stroke="currentColor" strokeWidth="1.5" rx="1" /><circle cx="8" cy="8" r="3.5" fill="currentColor" /></svg>
                                            Veg
                                        </span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="dietary" value="1" checked={newItem.dietaryPreference === "1"} onChange={(e) => setNewItem({...newItem, dietaryPreference: e.target.value})} className="text-teal-600 focus:ring-teal-500" />
                                        <span className="text-sm font-medium text-slate-700 flex items-center gap-1">
                                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-red-700"><rect x="1.5" y="1.5" width="13" height="13" stroke="currentColor" strokeWidth="1.5" rx="1" /><circle cx="8" cy="8" r="3.5" fill="currentColor" /></svg>
                                            Non-Veg
                                        </span>
                                    </label>
                                </div>
                            </div>
                            
                            <button type="submit" disabled={isAdding} className="w-full mt-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm disabled:opacity-70">
                                {isAdding ? "Saving..." : "Save Item"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}