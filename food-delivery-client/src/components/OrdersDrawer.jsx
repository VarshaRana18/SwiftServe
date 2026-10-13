import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

export default function OrdersDrawer() {
    const { isOrdersOpen, setIsOrdersOpen } = useCart();
    const [customerOrders, setCustomerOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch and Poll Orders when Drawer is open
    useEffect(() => {
        if (!isOrdersOpen) return;

        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await fetch("http://localhost:5121/api/order/customer", {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    
                    // Sort so newest orders are at the top
                    const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setCustomerOrders(sortedData);
                }
            } catch (error) {
                console.error("Failed to fetch customer orders:", error);
            } finally {
                setIsLoading(false);
            }
        };

        setIsLoading(true);
        fetchOrders();
        
        // MVP Real-time feel: Poll every 10 seconds while drawer is open
        const interval = setInterval(fetchOrders, 10000);
        return () => clearInterval(interval);

    }, [isOrdersOpen]);

    // Helper to translate backend integer enum to user-friendly UI badges
    const getStatusConfig = (statusCode) => {
        switch (statusCode) {
            case 0: return { label: "Pending", color: "bg-slate-100 text-slate-600 border-slate-200", icon: "🕒" };
            case 1: return { label: "Preparing", color: "bg-yellow-50 text-yellow-600 border-yellow-200", icon: "👨‍🍳" };
            case 2: return { label: "Ready for Pickup", color: "bg-blue-50 text-blue-600 border-blue-200", icon: "🛍️" };
            case 3: return { label: "Out for Delivery", color: "bg-orange-50 text-orange-600 border-orange-200", icon: "🛵" };
            case 4: return { label: "Delivered", color: "bg-green-50 text-green-600 border-green-200", icon: "✅" };
            case 5: return { label: "Cancelled", color: "bg-red-50 text-red-600 border-red-200", icon: "❌" };
            default: return { label: "Processing", color: "bg-slate-100 text-slate-600 border-slate-200", icon: "🔄" };
        }
    };

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
                        <p className="text-sm text-slate-500">Your recent food runs</p>
                    </div>
                    <button onClick={() => setIsOrdersOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Orders List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {isLoading && customerOrders.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                            <svg className="animate-spin h-8 w-8 text-orange-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            <p className="font-medium">Loading orders...</p>
                        </div>
                    ) : customerOrders.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                            <span className="text-5xl mb-4">🛵</span>
                            <p className="text-lg font-medium text-slate-500">No recent orders found</p>
                        </div>
                    ) : (
                        customerOrders.map((order) => {
                            const statusConfig = getStatusConfig(order.status);
                            
                            return (
                                <div key={order.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col gap-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center text-xl">
                                                {/* Fallback emoji if backend doesn't send restaurant image yet */}
                                                {order.restaurantImage ? <img src={order.restaurantImage} alt={order.restaurantName} className="w-full h-full object-cover" /> : "🍽️"}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-800 line-clamp-1">{order.restaurantName || "SwiftServe Order"}</span>
                                                <span className="text-xs font-medium text-slate-400">ID: {order.id.substring(0, 8).toUpperCase()}...</span>
                                            </div>
                                        </div>
                                        
                                        {/* Dynamic Status Badge */}
                                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${statusConfig.color}`}>
                                            <span className="text-sm">{statusConfig.icon}</span>
                                            <span className="text-[10px] font-bold uppercase tracking-wider">{statusConfig.label}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        {order.items && order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between py-1">
                                                <span>{item.quantity}x {item.menuItemName || "Item"}</span>
                                            </div>
                                        ))}
                                        <div className="flex justify-between pt-2 mt-2 border-t border-slate-200 font-bold text-slate-800">
                                            <span>Total Paid</span>
                                            <span>₹{order.totalAmount}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}