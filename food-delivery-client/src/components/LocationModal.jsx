import { useState, useEffect } from "react";
// Make sure to add setSelectedAddressId to your CartContext provider later!
import { useCart } from "../context/CartContext";

export default function LocationModal({ isOpen, onClose, setActiveLocation }) {
    // We assume you will add setSelectedAddressId to your CartContext for checkout later
    const { selectedAddressId, setSelectedAddressId } = useCart();

    const [view, setView] = useState("list"); // "list" | "add"
    const [addresses, setAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        label: "Home",
        fullAddress: "",
        pinCode: ""
    });

    // Fetch Addresses on Mount/Open
    useEffect(() => {
        if (isOpen && view === "list") {
            fetchAddresses();
        }
    }, [isOpen, view]);

    const fetchAddresses = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch("http://localhost:5121/api/address", {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setAddresses(data);
            }
        } catch (error) {
            console.error("Failed to fetch addresses");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5121/api/address/${id}`, {
                method: "DELETE",
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                // 1. Remove it from the local list
                setAddresses(prev => prev.filter(addr => addr.id !== id));

                // 2. NEW: If the deleted address is the currently selected one, reset the global state
                if (id === selectedAddressId) {
                    if (setSelectedAddressId) setSelectedAddressId(null);
                    if (setActiveLocation) setActiveLocation("Select Location");
                }
            }
        } catch (error) {
            console.error("Failed to delete address");
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch("http://localhost:5121/api/address", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setFormData({ label: "Home", fullAddress: "", pinCode: "" });
                setView("list"); // Automatically switch back to list view
            }
        } catch (error) {
            console.error("Failed to add address");
        } finally {
            setIsLoading(false);
        }
    };

    const selectAddress = (address) => {
        // Now includes the full street address alongside the label and pincode
        setActiveLocation(`${address.fullAddress}, ${address.pinCode}`);

        if (setSelectedAddressId) setSelectedAddressId(address.id);
        onClose();
    };

    const getIconForLabel = (label) => {
        if (label.toLowerCase() === 'home') return "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6";
        if (label.toLowerCase() === 'work') return "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z";
        return "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z";
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-fade-in" onClick={onClose}></div>
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">

                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {view === "add" && (
                            <button onClick={() => setView("list")} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                            </button>
                        )}
                        <h2 className="text-xl font-bold text-slate-800">
                            {view === "list" ? "Select Delivery Location" : "Add New Address"}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="px-6 pb-6">
                    {view === "list" ? (
                        <div className="flex flex-col gap-4">
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">Saved Addresses</h3>
                                {isLoading ? (
                                    <div className="text-center py-4 text-slate-500 text-sm">Loading addresses...</div>
                                ) : addresses.length === 0 ? (
                                    <div className="text-center py-4 text-slate-400 text-sm border border-dashed border-slate-200 rounded-xl">No saved addresses yet.</div>
                                ) : (
                                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                        {addresses.map((loc) => {
                                            const isSelected = loc.id === selectedAddressId;

                                            return (
                                                <div
                                                    key={loc.id}
                                                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors border group cursor-pointer ${isSelected
                                                            ? 'bg-orange-50 border-orange-200'
                                                            : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100'
                                                        }`}
                                                    onClick={() => selectAddress(loc)}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`p-2.5 rounded-xl ${isSelected
                                                                ? 'bg-orange-100 text-orange-500'
                                                                : 'bg-slate-100 text-slate-500'
                                                            }`}>
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={getIconForLabel(loc.label)} />
                                                            </svg>
                                                        </div>
                                                        <div className="flex flex-col text-left">
                                                            {/* Label is removed from display, showing full address prominently */}
                                                            <span className={`font-semibold line-clamp-1 ${isSelected ? 'text-orange-700' : 'text-slate-700'}`}>
                                                                {loc.fullAddress}
                                                            </span>
                                                            <span className={`text-xs ${isSelected ? 'text-orange-500/80' : 'text-slate-400'}`}>
                                                                Pin: {loc.pinCode}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={(e) => handleDelete(e, loc.id)}
                                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            <button onClick={() => setView("add")} className="w-full py-3.5 mt-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors">
                                + Add New Address
                            </button>
                        </div>
                    ) : (

                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Save As (Label)</label>
                                <select
                                    value={formData.label}
                                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-slate-50 focus:bg-white"
                                >
                                    <option value="Home">Home</option>
                                    <option value="Work">Work</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Full Address</label>
                                <textarea
                                    value={formData.fullAddress}
                                    onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                                    placeholder="House No, Building, Street, Area"
                                    required
                                    rows="3"
                                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-slate-50 focus:bg-white resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Pin Code</label>
                                <input
                                    type="text"
                                    value={formData.pinCode}
                                    onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                                    placeholder="390001"
                                    required
                                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-slate-50 focus:bg-white"
                                />
                            </div>

                            <button type="submit" disabled={isLoading} className="w-full py-3.5 mt-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-95 disabled:opacity-70">
                                {isLoading ? "Saving..." : "Save Address"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}