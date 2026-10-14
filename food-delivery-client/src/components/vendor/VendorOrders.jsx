import { useState, useEffect } from "react";

export default function VendorOrders({ activeRestaurantId }) {
    const [orders, setOrders] = useState([]);
    const [mobileOrderTab, setMobileOrderTab] = useState("Incoming");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!activeRestaurantId) return;

        const fetchOrders = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:5121/api/order/vendor/${activeRestaurantId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    
                    // Map backend data to UI format
                    const mappedOrders = data.map(o => {
                        
                        // EXACT MATCH FOR JSON: o.orderItems and i.menuItem.name
                        const itemsStr = o.orderItems && o.orderItems.length > 0 
                            ? o.orderItems.map(i => `${i.quantity}x ${i.menuItem?.name || 'Item'}`).join(', ') 
                            : "Order items unavailable";

                        // EXACT MATCH FOR JSON: o.customer.fullName
                        const custName = o.customer?.fullName || `Customer #${o.id.substring(0, 4).toUpperCase()}`;

                        // Translate Backend Enum to UI Tab Names
                        let uiStatus = "Incoming"; // Fallback / 0 = Pending
                        if (o.status === 1 || o.status === "Accepted") uiStatus = "Preparing";
                        if (o.status === 2 || o.status === "Ready") uiStatus = "Ready";
                        if (o.status >= 3 || o.status === "PickedUp" || o.status === "Delivered") uiStatus = "Completed";

                        return {
                            id: o.id,
                            customerName: custName,
                            items: itemsStr,
                            total: `₹${o.totalAmount || 0}`,
                            status: uiStatus,
                            time: o.createdAt ? new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"
                        };
                    }).filter(o => o.status !== "Completed"); // Hide orders once driver picks them up

                    setOrders(mappedOrders);
                }
            } catch (error) {
                console.error("Failed to fetch vendor orders:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
        
        // Optional MVP Polish: Poll for new orders every 10 seconds
        const interval = setInterval(fetchOrders, 10000);
        return () => clearInterval(interval);

    }, [activeRestaurantId]);

    const updateOrderStatus = async (orderId, newUiStatus) => {
        // Map UI string back to backend Enum integer
        const backendStatusInt = newUiStatus === "Preparing" ? 1 : 2;

        // Optimistic UI Update
        setOrders(prevOrders => prevOrders.map(order => 
            order.id === orderId ? { ...order, status: newUiStatus } : order
        ));
        if (window.innerWidth < 1024) setMobileOrderTab(newUiStatus);

        // Send to backend
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:5121/api/order/${orderId}/status`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: backendStatusInt })
            });
        } catch (error) {
            console.error("Failed to update order status:", error);
        }
    };

    if (isLoading && orders.length === 0) {
        return <div className="h-full flex items-center justify-center text-slate-400 font-bold">Loading incoming orders...</div>;
    }

    return (
        <div className="h-full flex flex-col">
            <div className="lg:hidden flex bg-slate-200/50 p-1 rounded-xl mb-4 shrink-0">
                {["Incoming", "Preparing", "Ready"].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setMobileOrderTab(tab)}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${mobileOrderTab === tab ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        {tab} ({orders.filter(o => o.status === tab).length})
                    </button>
                ))}
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-x-auto pb-4">
                
                {/* Incoming / Pending (0) */}
                <div className={`flex-1 flex-col bg-slate-100/50 rounded-3xl p-4 border border-slate-200/60 min-w-[280px] lg:min-w-[320px] ${mobileOrderTab === "Incoming" ? "flex" : "hidden lg:flex"}`}>
                    <div className="flex items-center justify-between mb-4 px-2 shrink-0">
                        <h2 className="font-bold text-slate-700 flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
                            Incoming
                        </h2>
                        <span className="bg-white text-slate-500 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm hidden lg:inline-block">
                            {orders.filter(o => o.status === "Incoming").length}
                        </span>
                    </div>
                    <div className="space-y-4 overflow-y-auto pr-1 flex-1 pb-20 lg:pb-0">
                        {orders.filter(o => o.status === "Incoming").map(order => (
                            <div key={order.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="font-bold text-slate-800 line-clamp-1 break-all">{order.customerName}</span>
                                    <span className="text-xs font-medium text-slate-400 shrink-0 ml-2">{order.time}</span>
                                </div>
                                <p className="text-sm font-medium text-slate-600 mb-6">{order.items}</p>
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <span className="font-bold text-teal-600 text-lg">{order.total}</span>
                                    <button onClick={() => updateOrderStatus(order.id, "Preparing")} className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors shadow-sm shrink-0">
                                        Accept
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Preparing / Accepted (1) */}
                <div className={`flex-1 flex-col bg-slate-100/50 rounded-3xl p-4 border border-slate-200/60 min-w-[280px] lg:min-w-[320px] ${mobileOrderTab === "Preparing" ? "flex" : "hidden lg:flex"}`}>
                    <div className="flex items-center justify-between mb-4 px-2 shrink-0">
                        <h2 className="font-bold text-slate-700 flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                            Preparing
                        </h2>
                        <span className="bg-white text-slate-500 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm hidden lg:inline-block">
                            {orders.filter(o => o.status === "Preparing").length}
                        </span>
                    </div>
                    <div className="space-y-4 overflow-y-auto pr-1 flex-1 pb-20 lg:pb-0">
                        {orders.filter(o => o.status === "Preparing").map(order => (
                            <div key={order.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-yellow-400">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="font-bold text-slate-800 line-clamp-1 break-all">{order.customerName}</span>
                                    <span className="text-xs font-medium text-slate-400 shrink-0 ml-2">{order.time}</span>
                                </div>
                                <p className="text-sm font-medium text-slate-600 mb-6">{order.items}</p>
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <span className="font-bold text-slate-400 line-through decoration-slate-300 text-lg">{order.total}</span>
                                    <button onClick={() => updateOrderStatus(order.id, "Ready")} className="bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-200 text-slate-700 hover:text-teal-700 text-sm font-bold px-6 py-2.5 rounded-xl transition-colors shrink-0">
                                        Ready
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ready for Pickup / Ready (2) */}
                <div className={`flex-1 flex-col bg-slate-100/50 rounded-3xl p-4 border border-slate-200/60 min-w-[280px] lg:min-w-[320px] ${mobileOrderTab === "Ready" ? "flex" : "hidden lg:flex"}`}>
                    <div className="flex items-center justify-between mb-4 px-2 shrink-0">
                        <h2 className="font-bold text-slate-700 flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                            Ready for Pickup
                        </h2>
                        <span className="bg-white text-slate-500 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm hidden lg:inline-block">
                            {orders.filter(o => o.status === "Ready").length}
                        </span>
                    </div>
                    <div className="space-y-4 overflow-y-auto pr-1 flex-1 pb-20 lg:pb-0">
                        {orders.filter(o => o.status === "Ready").map(order => (
                            <div key={order.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-green-400 opacity-75">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="font-bold text-slate-800 line-clamp-1 break-all">{order.customerName}</span>
                                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md shrink-0 ml-2">Awaiting Driver</span>
                                </div>
                                <p className="text-sm font-medium text-slate-500 mb-6">{order.items}</p>
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <span className="font-bold text-slate-400 line-through decoration-slate-300 text-lg">{order.total}</span>
                                    <div className="bg-slate-50 border border-slate-200 text-slate-400 text-sm font-bold px-6 py-2.5 rounded-xl text-center shrink-0">
                                        Sealed
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}