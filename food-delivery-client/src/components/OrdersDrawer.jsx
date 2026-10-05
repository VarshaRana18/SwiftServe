import { useCart } from "../context/CartContext";

export default function OrdersDrawer() {
    const { isOrdersOpen, setIsOrdersOpen, orderHistory } = useCart();

    return (
        <div className={`fixed inset-0 z-50 flex justify-end overflow-hidden ${isOrdersOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            {/* Backdrop */}
            <div 
                className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ease-out ${isOrdersOpen ? 'opacity-100' : 'opacity-0'}`} 
                onClick={() => setIsOrdersOpen(false)}
            ></div>
            
            {/* Drawer */}
            <div className={`relative w-full max-w-md bg-slate-50 h-full shadow-2xl flex flex-col transition-transform duration-300 ease-out ${isOrdersOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                
                {/* Header */}
                <div className="p-6 bg-white border-b border-slate-100 flex items-center justify-between shrink-0 shadow-sm z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Track Orders</h2>
                        <p className="text-sm text-slate-500">{orderHistory.length} Past & Active Orders</p>
                    </div>
                    <button onClick={() => setIsOrdersOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Orders List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {orderHistory.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                            <span className="text-5xl mb-4">🛵</span>
                            <p className="text-lg font-medium text-slate-500">No recent orders found</p>
                        </div>
                    ) : (
                        orderHistory.map((order, index) => (
                            <div key={index} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                                            <img src={order.image} alt={order.restaurantName} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-800">{order.restaurantName}</span>
                                            <span className="text-xs font-medium text-slate-400">{order.orderId}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Dynamic Status Badge */}
                                    <div className="flex items-center gap-1.5 bg-orange-50 text-orange-600 px-2.5 py-1 rounded-lg border border-orange-100">
                                        <svg className="w-3.5 h-3.5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <span className="text-[10px] font-bold uppercase tracking-wider">{order.status}</span>
                                    </div>
                                </div>

                                <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    {order.items.map(item => (
                                        <div key={item.id} className="flex justify-between py-1">
                                            <span>{item.qty}x {item.name}</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between pt-2 mt-2 border-t border-slate-200 font-bold text-slate-800">
                                        <span>Total Paid</span>
                                        <span>₹{order.totalAmount}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}