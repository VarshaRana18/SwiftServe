import { useCart } from "../context/CartContext";

export default function CartDrawer() {
    const { 
        isCartOpen, setIsCartOpen, activeCartView, setActiveCartView, 
        globalCarts, updateQuantity, deleteCart, confirmDeleteId, setConfirmDeleteId, 
        confirmItemDeleteId, setConfirmItemDeleteId, getCartTotal, getGrandTotal 
    } = useCart();

    return (
        <div className={`fixed inset-0 z-50 flex justify-end overflow-hidden ${isCartOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            <div className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ease-out ${isCartOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsCartOpen(false)}></div>
            <div className={`relative w-full max-w-md bg-slate-50 h-full shadow-2xl flex flex-col transition-transform duration-300 ease-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                
                {activeCartView === null && (
                    <>
                        <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
                            <div><h2 className="text-2xl font-bold text-slate-800">Your Carts</h2><p className="text-sm text-slate-500">{Object.keys(globalCarts).length} Active Orders</p></div>
                            <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {Object.keys(globalCarts).length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400"><p className="text-lg font-medium text-slate-500">Your carts are empty</p></div>
                            ) : (
                                Object.entries(globalCarts).map(([id, cart]) => (
                                    <div key={id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <img src={cart.image} alt={cart.restaurantName} className="w-14 h-14 rounded-xl object-cover" />
                                            <div><h3 className="font-bold text-slate-800">{cart.restaurantName}</h3><p className="text-sm text-slate-500">{cart.items.reduce((sum, i) => sum + i.qty, 0)} Items • ₹{getCartTotal(id)}</p></div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {confirmDeleteId === id ? (
                                                <div className="flex items-center gap-1.5 bg-red-50 p-1 rounded-xl">
                                                    <span className="text-[11px] font-bold text-red-600 px-2 uppercase tracking-wide">Delete?</span>
                                                    <button onClick={() => deleteCart(id)} className="bg-red-500 text-white p-1.5 rounded-lg hover:bg-red-600 transition-colors shadow-sm"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg></button>
                                                    <button onClick={() => setConfirmDeleteId(null)} className="bg-white text-slate-500 p-1.5 rounded-lg shadow-sm border border-slate-200 hover:text-slate-700 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                                                </div>
                                            ) : (
                                                <><button onClick={() => setActiveCartView(id)} className="bg-orange-50 text-orange-600 font-bold px-4 py-2 rounded-xl text-sm hover:bg-orange-100 transition-colors">View</button><button onClick={() => setConfirmDeleteId(id)} className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button></>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        {Object.keys(globalCarts).length > 0 && (
                            <div className="p-6 bg-white border-t border-slate-100 shrink-0"><button className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-colors shadow-lg active:scale-95 flex items-center justify-between px-6"><span>Checkout All</span><span>₹{getGrandTotal()}</span></button></div>
                        )}
                    </>
                )}

                {activeCartView !== null && globalCarts[activeCartView] && (
                    <>
                        <div className="p-6 bg-white border-b border-slate-100 flex items-center gap-4 shrink-0 shadow-sm z-10">
                            <button onClick={() => { setActiveCartView(null); setConfirmItemDeleteId(null); }} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></button>
                            <div className="flex-1"><h2 className="text-xl font-bold text-slate-800 line-clamp-1">{globalCarts[activeCartView].restaurantName}</h2><p className="text-xs font-semibold text-orange-500 uppercase tracking-wide">Review Order</p></div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {globalCarts[activeCartView].items.map(item => (
                                <div key={item.id} className="flex justify-between items-start gap-4">
                                    <div className="flex-1"><h4 className="font-semibold text-slate-800">{item.name}</h4><p className="text-slate-500 text-sm mt-1">₹{item.price}</p></div>
                                    <div className="flex items-center gap-3 bg-slate-100 rounded-lg p-1 min-h-[40px]">
                                        {confirmItemDeleteId === item.id ? (
                                            <div className="flex items-center gap-1.5 bg-red-50 p-1 rounded-md">
                                                <span className="text-[10px] font-bold text-red-600 px-1 uppercase">Remove?</span>
                                                <button onClick={() => updateQuantity(activeCartView, item.id, -1)} className="bg-red-500 text-white p-1.5 rounded hover:bg-red-600 transition-colors shadow-sm"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg></button>
                                                <button onClick={() => setConfirmItemDeleteId(null)} className="bg-white text-slate-500 p-1.5 rounded border border-slate-200 hover:text-slate-700 transition-colors shadow-sm"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                                            </div>
                                        ) : (
                                            <><button onClick={() => { if (item.qty === 1) setConfirmItemDeleteId(item.id); else updateQuantity(activeCartView, item.id, -1); }} className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors font-bold shadow-sm ${item.qty === 1 ? 'text-red-500 hover:bg-red-50' : 'text-slate-600 hover:bg-white'}`}>{item.qty === 1 ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg> : "-"}</button><span className="font-bold text-sm w-4 text-center">{item.qty}</span><button onClick={() => updateQuantity(activeCartView, item.id, 1)} className="w-8 h-8 flex items-center justify-center text-orange-500 hover:bg-white rounded-md transition-colors font-bold shadow-sm">+</button></>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div className="pt-6 border-t border-dashed border-slate-200"><div className="flex justify-between text-sm text-slate-500 mb-2"><span>Subtotal</span><span>₹{getCartTotal(activeCartView)}</span></div><div className="flex justify-between text-sm text-slate-500"><span>Platform Fee</span><span>₹10</span></div></div>
                        </div>
                        <div className="p-6 bg-white border-t border-slate-100 shrink-0"><button className="w-full bg-orange-500 text-white font-bold py-4 rounded-2xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200 active:scale-95 flex items-center justify-between px-6"><span>Checkout</span><span>₹{getCartTotal(activeCartView) + 10}</span></button></div>
                    </>
                )}
            </div>
        </div>
    );
}