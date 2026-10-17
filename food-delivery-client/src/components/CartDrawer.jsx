import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

export default function CartDrawer() {
    const {
        isCartOpen, setIsCartOpen,
        activeCartView, setActiveCartView,
        globalCarts, updateQuantity, deleteCart,
        confirmDeleteId, setConfirmDeleteId,
        confirmItemDeleteId, setConfirmItemDeleteId,
        getCartTotal, setIsOrdersOpen, checkoutCart,
        selectedAddressId, activeLocation, setIsLocationModalOpen
    } = useCart();

    const [isCheckoutMode, setIsCheckoutMode] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    // NEW: Phone Number States
    // For MVP, we cache it locally to prevent forcing the user to type it every session,
    // while still sending it to the backend to update their central profile.
    const [phoneNumber, setPhoneNumber] = useState(localStorage.getItem('customerPhone') || "");
    const [isPhoneEditing, setIsPhoneEditing] = useState(!localStorage.getItem('customerPhone'));
    const [isSavingPhone, setIsSavingPhone] = useState(false);

    // Single restaurant math
    const subtotal = activeCartView ? getCartTotal(activeCartView) : 0;
    const platformFee = 10;
    const totalToPay = subtotal + platformFee;

    // NEW: Handle Saving the Phone Number
    // NEW: Handle Saving the Phone Number (Using Unified API)
    const handleSavePhone = async () => {
        if (!phoneNumber || phoneNumber.length < 8) {
            alert("Please enter a valid phone number.");
            return;
        }

        setIsSavingPhone(true);
        try {
            const token = localStorage.getItem('token');
            
            // We use the new unified profile API here! 
            // Note for Varsha: Her backend should allow "partial updates", 
            // meaning if we only send the phoneNumber, it shouldn't overwrite the name/email with null.
            const response = await fetch("http://localhost:5121/api/auth/profile", {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ phoneNumber })
            });

            localStorage.setItem('customerPhone', phoneNumber);
            setIsPhoneEditing(false);

        } catch (error) {
            console.error("Failed to save phone number:", error);
            localStorage.setItem('customerPhone', phoneNumber);
            setIsPhoneEditing(false);
        } finally {
            setIsSavingPhone(false);
        }
    };

    const handlePlaceOrder = async () => {
        // Validation Gate
        if (!selectedAddressId || !activeCartView || !phoneNumber || isPhoneEditing) return;
        
        setIsPlacingOrder(true);

        const success = await checkoutCart(activeCartView, 0);

        if (success) {
            setIsCheckoutMode(false);
            setActiveCartView(null);
            setIsCartOpen(false);
            setIsOrdersOpen(true);
        } else {
            setIsCheckoutMode(false);
            setActiveCartView(null);
        }
        
        setIsPlacingOrder(false);
    };

    return (
        <div className={`fixed inset-0 z-50 flex justify-end overflow-hidden ${isCartOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            <div className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ease-out ${isCartOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsCartOpen(false)}></div>

            <div className={`relative w-full max-w-md bg-slate-50 h-full shadow-2xl flex flex-col transition-transform duration-300 ease-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* VIEW A: THE CART HUB */}
                {activeCartView === null && !isCheckoutMode && (
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
                                                    <button onClick={() => deleteCart(id)} className="bg-red-500 text-white p-1.5 rounded-lg hover:bg-red-600 transition-colors shadow-sm"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg></button>
                                                    <button onClick={() => setConfirmDeleteId(null)} className="bg-white text-slate-500 p-1.5 rounded-lg shadow-sm border border-slate-200 hover:text-slate-700 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                                                </div>
                                            ) : (
                                                <>
                                                    <button onClick={() => setActiveCartView(id)} className="bg-orange-50 text-orange-600 font-bold px-4 py-2 rounded-xl text-sm hover:bg-orange-100 transition-colors">View</button>
                                                    <button onClick={() => setConfirmDeleteId(id)} className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}

                {/* VIEW B: SPECIFIC CART DETAIL */}
                {activeCartView !== null && globalCarts[activeCartView] && !isCheckoutMode && (
                    <>
                        <div className="p-6 bg-white border-b border-slate-100 flex items-center gap-4 shrink-0 shadow-sm z-10">
                            <button onClick={() => { setActiveCartView(null); setConfirmItemDeleteId(null); }} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
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
                                    <div className="flex items-center gap-3 bg-slate-100 rounded-lg p-1 min-h-[40px]">
                                        {confirmItemDeleteId === item.id ? (
                                            <div className="flex items-center gap-1.5 bg-red-50 p-1 rounded-md">
                                                <span className="text-[10px] font-bold text-red-600 px-1 uppercase">Remove?</span>
                                                <button onClick={() => updateQuantity(activeCartView, item.id, -1)} className="bg-red-500 text-white p-1.5 rounded hover:bg-red-600 transition-colors shadow-sm"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg></button>
                                                <button onClick={() => setConfirmItemDeleteId(null)} className="bg-white text-slate-500 p-1.5 rounded border border-slate-200 hover:text-slate-700 transition-colors shadow-sm"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                                            </div>
                                        ) : (
                                            <>
                                                <button onClick={() => { if (item.qty === 1) setConfirmItemDeleteId(item.id); else updateQuantity(activeCartView, item.id, -1); }} className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors font-bold shadow-sm ${item.qty === 1 ? 'text-red-500 hover:bg-red-50' : 'text-slate-600 hover:bg-white'}`}>{item.qty === 1 ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg> : "-"}</button>
                                                <span className="font-bold text-sm w-4 text-center">{item.qty}</span>
                                                <button onClick={() => updateQuantity(activeCartView, item.id, 1)} className="w-8 h-8 flex items-center justify-center text-orange-500 hover:bg-white rounded-md transition-colors font-bold shadow-sm">+</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}

                            <div className="pt-6 border-t border-dashed border-slate-200">
                                <div className="flex justify-between text-sm text-slate-500 mb-2">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-500">
                                    <span>Platform Fee</span>
                                    <span>₹{platformFee}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-white border-t border-slate-100 shrink-0">
                            <button onClick={() => setIsCheckoutMode(true)} className="w-full bg-orange-500 text-white font-bold py-4 rounded-2xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200 active:scale-95 flex items-center justify-between px-6">
                                <span>Proceed to Pay</span>
                                <span>₹{subtotal + platformFee}</span>
                            </button>
                        </div>
                    </>
                )}

                {/* VIEW C: FINAL CHECKOUT / PAYMENT */}
                {isCheckoutMode && activeCartView && globalCarts[activeCartView] && (
                    <div className="flex flex-col h-full bg-slate-50 animate-fade-in">
                        <div className="p-6 bg-white border-b border-slate-100 flex items-center gap-4 shrink-0 shadow-sm z-10">
                            <button onClick={() => setIsCheckoutMode(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            </button>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-slate-800">Checkout</h2>
                                <p className="text-xs font-semibold text-slate-500">Payment & Delivery</p>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            
                            {/* 1. Delivery Address */}
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-slate-800">Delivery Address</h3>
                                    {selectedAddressId && (
                                        <button onClick={() => setIsLocationModalOpen && setIsLocationModalOpen(true)} className="text-sm font-bold text-orange-500 hover:text-orange-600">Change</button>
                                    )}
                                </div>
                                {!selectedAddressId ? (
                                    <button onClick={() => setIsLocationModalOpen && setIsLocationModalOpen(true)} className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-orange-300 bg-orange-50 text-orange-600 font-bold hover:bg-orange-100 transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                        Select Delivery Address
                                    </button>
                                ) : (
                                    <div className="p-4 rounded-2xl border border-slate-200 bg-white flex items-start gap-3">
                                        <div className="bg-slate-100 p-2 rounded-xl text-slate-500 shrink-0">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-700">Delivering To</span>
                                            <span className="text-sm text-slate-500">{activeLocation || "Saved Address"}</span>
                                        </div>
                                    </div>
                                )}
                            </section>

                            {/* 2. NEW: Contact Number Requirement */}
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-slate-800">Contact Number</h3>
                                    {!isPhoneEditing && (
                                        <button onClick={() => setIsPhoneEditing(true)} className="text-sm font-bold text-orange-500 hover:text-orange-600">Change</button>
                                    )}
                                </div>
                                
                                {isPhoneEditing ? (
                                    <div className="flex gap-2">
                                        <input 
                                            type="tel" 
                                            value={phoneNumber} 
                                            onChange={(e) => setPhoneNumber(e.target.value)} 
                                            placeholder="e.g. +91 9876543210" 
                                            className="flex-1 bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium text-sm" 
                                        />
                                        <button 
                                            onClick={handleSavePhone} 
                                            disabled={isSavingPhone} 
                                            className="bg-orange-50 text-orange-600 font-bold px-5 py-3 rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors shrink-0 disabled:opacity-50"
                                        >
                                            {isSavingPhone ? "..." : "Save"}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="p-4 rounded-2xl border border-slate-200 bg-white flex items-center gap-3">
                                        <div className="bg-slate-100 p-2 rounded-xl text-slate-500 shrink-0">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                        </div>
                                        <span className="font-bold text-slate-700">{phoneNumber}</span>
                                    </div>
                                )}
                            </section>

                            {/* 3. Payment Method */}
                            <section>
                                <h3 className="font-bold text-slate-800 mb-4">Payment Method</h3>
                                <div className="space-y-3">
                                    <label className="flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all bg-orange-50/50 border-orange-500 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center border-orange-500">
                                                <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>
                                            </div>
                                            <span className="font-semibold text-slate-700">Cash on Delivery</span>
                                        </div>
                                    </label>
                                </div>
                            </section>

                            {/* 4. Bill Details */}
                            <section className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                <h3 className="font-bold text-slate-800 mb-4">Bill Details</h3>
                                <div className="space-y-2 text-sm text-slate-600 mb-4">
                                    <div className="flex justify-between">
                                        <span>Item Total</span>
                                        <span>₹{subtotal}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Platform Fee</span>
                                        <span>₹{platformFee}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between font-bold text-lg text-slate-800 pt-4 border-t border-slate-100">
                                    <span>To Pay</span>
                                    <span>₹{totalToPay}</span>
                                </div>
                            </section>
                        </div>

                        <div className="p-6 bg-white border-t border-slate-100 shrink-0">
                            {/* Validation Gate: Disables button if missing address, phone, or if currently saving phone */}
                            <button 
                                onClick={handlePlaceOrder} 
                                disabled={isPlacingOrder || !selectedAddressId || !phoneNumber || isPhoneEditing} 
                                className={`w-full text-white font-bold py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 
                                    ${isPlacingOrder ? 'bg-slate-400 cursor-wait' 
                                    : (!selectedAddressId || !phoneNumber || isPhoneEditing) ? 'bg-slate-300 cursor-not-allowed shadow-none text-slate-500' 
                                    : 'bg-green-500 hover:bg-green-600 shadow-green-200 active:scale-95'}`}
                            >
                                {isPlacingOrder ? (
                                    <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Processing...</>
                                ) : !selectedAddressId ? (
                                    <>Address Required</>
                                ) : (!phoneNumber || isPhoneEditing) ? (
                                    <>Phone Number Required</>
                                ) : (
                                    <>Place Order • ₹{totalToPay}</>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}