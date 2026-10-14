import { useState, useMemo, useEffect } from "react";

export default function VendorMenu({ activeRestaurantId }) {
    const [inventory, setInventory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [menuSearch, setMenuSearch] = useState("");
    const [menuCategory, setMenuCategory] = useState("All");
    
    // Unified Modal States (Handles both Add and Edit)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        name: "",
        description: "",
        price: "",
        category: "",
        dietaryPreference: "0" // 0 = Veg, 1 = Non-Veg
    });

    // Custom Delete Modal States
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

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

    // NEW PATCH API for Availability Toggle
    const toggleItemAvailability = async (itemId) => {
        setInventory(prev => prev.map(item => item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item));
        
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:5121/api/menuitem/${itemId}/toggle-availability`, {
                method: "PATCH",
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (error) {
            console.error("Failed to toggle availability");
        }
    };

    const triggerDelete = (item) => {
        setItemToDelete(item);
        setIsDeleteModalOpen(true);
    };

    // NEW DELETE API Execution
    const confirmDelete = async () => {
        if (!itemToDelete) return;
        
        const itemId = itemToDelete.id;
        setInventory(prev => prev.filter(item => item.id !== itemId)); // Optimistic delete
        setIsDeleteModalOpen(false);
        setItemToDelete(null);

        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:5121/api/menuitem/${itemId}`, {
                method: "DELETE",
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (error) {
            console.error("Failed to delete menu item");
        }
    };

    const openAddModal = () => {
        setModalMode("add");
        setFormData({ id: null, name: "", description: "", price: "", category: "", dietaryPreference: "0" });
        setIsModalOpen(true);
    };

    const openEditModal = (item) => {
        setModalMode("edit");
        setFormData({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price.toString(),
            category: item.category || "",
            dietaryPreference: item.dietaryPreference.toString()
        });
        setIsModalOpen(true);
    };

    // Unified Save Function (POST for Add, PUT for Edit)
    const handleSaveItem = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const token = localStorage.getItem('token');

        try {
            if (modalMode === "add") {
                const addPayload = {
                    name: formData.name,
                    description: formData.description,
                    price: parseFloat(formData.price),
                    category: formData.category,
                    dietaryPreference: parseInt(formData.dietaryPreference),
                    restaurantId: activeRestaurantId
                };

                const response = await fetch("http://localhost:5121/api/menuitem", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(addPayload)
                });

                if (response.ok) {
                    const addedItem = await response.json();
                    if (addedItem.isAvailable === undefined) addedItem.isAvailable = true;
                    setInventory(prev => [...prev, addedItem]);
                    setIsModalOpen(false);
                }
            } else {
                // Edit Payload omits RestaurantId as per Varsha's update
                const editPayload = {
                    name: formData.name,
                    description: formData.description,
                    price: parseFloat(formData.price),
                    category: formData.category,
                    dietaryPreference: parseInt(formData.dietaryPreference)
                };

                const response = await fetch(`http://localhost:5121/api/menuitem/${formData.id}`, {
                    method: "PUT",
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(editPayload)
                });

                if (response.ok) {
                    setInventory(prev => prev.map(item => item.id === formData.id ? { ...item, ...editPayload } : item));
                    setIsModalOpen(false);
                }
            }
        } catch (error) {
            console.error("Network error");
        } finally {
            setIsSaving(false);
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
                        <button onClick={openAddModal} className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm shrink-0 whitespace-nowrap">
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

                            <div className="flex flex-col items-end gap-3 shrink-0">
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] sm:text-xs font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-md ${item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                        {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                    <button onClick={() => toggleItemAvailability(item.id)} className={`w-10 h-5 sm:w-12 h-6 rounded-full transition-colors relative shadow-inner ${item.isAvailable ? 'bg-teal-500' : 'bg-slate-300'}`}>
                                        <div className={`w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full absolute top-1 shadow transition-transform ${item.isAvailable ? 'translate-x-6 sm:translate-x-7' : 'translate-x-1'}`}></div>
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => openEditModal(item)} className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    </button>
                                    <button onClick={() => triggerDelete(item)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <h2 className="text-lg font-bold text-slate-800">
                                {modalMode === "add" ? "Add New Item" : "Edit Item"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSaveItem} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Item Name</label>
                                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-slate-50 focus:bg-white" placeholder="e.g. Masala Dosa" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                                <textarea required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-slate-50 focus:bg-white resize-none" rows="2" placeholder="Describe the item..." />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Price (₹)</label>
                                    <input type="number" step="0.01" required min="0" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-slate-50 focus:bg-white" placeholder="120.00" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                                    <input type="text" required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none bg-slate-50 focus:bg-white" placeholder="e.g. Dosa" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Dietary Preference</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="dietary" value="0" checked={formData.dietaryPreference === "0"} onChange={(e) => setFormData({...formData, dietaryPreference: e.target.value})} className="text-teal-600 focus:ring-teal-500" />
                                        <span className="text-sm font-medium text-slate-700 flex items-center gap-1">
                                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-green-600"><rect x="1.5" y="1.5" width="13" height="13" stroke="currentColor" strokeWidth="1.5" rx="1" /><circle cx="8" cy="8" r="3.5" fill="currentColor" /></svg>
                                            Veg
                                        </span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="dietary" value="1" checked={formData.dietaryPreference === "1"} onChange={(e) => setFormData({...formData, dietaryPreference: e.target.value})} className="text-teal-600 focus:ring-teal-500" />
                                        <span className="text-sm font-medium text-slate-700 flex items-center gap-1">
                                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-red-700"><rect x="1.5" y="1.5" width="13" height="13" stroke="currentColor" strokeWidth="1.5" rx="1" /><circle cx="8" cy="8" r="3.5" fill="currentColor" /></svg>
                                            Non-Veg
                                        </span>
                                    </label>
                                </div>
                            </div>
                            
                            <button type="submit" disabled={isSaving} className="w-full mt-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm disabled:opacity-70">
                                {isSaving ? "Saving..." : modalMode === "add" ? "Save Item" : "Update Item"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsDeleteModalOpen(false)}></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-slide-up p-6 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">Delete Menu Item?</h2>
                        <p className="text-sm text-slate-500 mb-6">
                            Are you sure you want to delete <span className="font-bold text-slate-700">{itemToDelete?.name}</span>? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors">
                                Cancel
                            </button>
                            <button onClick={confirmDelete} className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors shadow-sm">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}