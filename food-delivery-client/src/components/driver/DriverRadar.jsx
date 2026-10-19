import { useState, useEffect } from "react";

export default function DriverRadar({ isOnline, hasActiveOrder, onAcceptOrder }) {
    // Replaced single incomingOrder with an array of available orders
    const [availableOrders, setAvailableOrders] = useState([]);
    const [isClaiming, setIsClaiming] = useState(false);

    // Poll for active orders
    useEffect(() => {
        let pollInterval;
        
        const fetchAvailableOrders = async () => {
            // Stop polling if offline or busy
            if (!isOnline || hasActiveOrder) return;
            
            try {
                const token = localStorage.getItem('token');
                const response = await fetch("http://localhost:5121/api/driver/available-orders", {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setAvailableOrders(data || []);
                }
            } catch (error) {
                console.error("Failed to poll orders:", error);
            }
        };

        if (isOnline && !hasActiveOrder) {
            fetchAvailableOrders(); // Fetch immediately on toggle
            pollInterval = setInterval(fetchAvailableOrders, 5000); // Poll every 5 seconds
        } else {
            setAvailableOrders([]); // Clear the list if they go offline or take an order
        }

        return () => clearInterval(pollInterval);
    }, [isOnline, hasActiveOrder]);

    const handleAccept = async (order) => {
        setIsClaiming(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5121/api/driver/${order.id}/claim`, {
                method: "PUT",
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                onAcceptOrder(order); // Send full order back to Dashboard
                // The dashboard will immediately set hasActiveOrder = true, hiding this view
            } else {
                alert("This order was claimed by another driver or is no longer available.");
                // Remove the failed order from the list
                setAvailableOrders(prev => prev.filter(o => o.id !== order.id));
            }
        } catch (error) {
            console.error("Failed to claim order:", error);
            alert("Network error while trying to claim the order.");
        } finally {
            setIsClaiming(false);
        }
    };

    return (
        <div className="h-full flex flex-col relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-blue-50" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            <div className="relative z-10 flex flex-col h-full justify-between p-6">
                
                {/* Status Card */}
                <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-white flex flex-col items-center text-center mt-2 transition-all shrink-0">
                    {hasActiveOrder ? (
                        <>
                            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-3 shadow-sm">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h2 className="font-extrabold text-slate-800 text-xl tracking-tight mb-1">Delivery in Progress</h2>
                            <p className="text-sm font-medium text-slate-500">Check the Route tab to complete it.</p>
                        </>
                    ) : isOnline ? (
                        <>
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3 animate-bounce shadow-sm">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </div>
                            <h2 className="font-extrabold text-slate-800 text-xl tracking-tight mb-1">
                                {availableOrders.length > 0 ? "New Requests Available!" : "Finding Orders..."}
                            </h2>
                            <p className="text-sm font-medium text-slate-500">
                                {availableOrders.length > 0 ? "Select a delivery from the list below." : "Scanning area for new delivery requests."}
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-3">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="font-extrabold text-slate-800 text-xl tracking-tight mb-1">You are Offline</h2>
                            <p className="text-sm font-medium text-slate-500">Go online to start receiving delivery requests.</p>
                        </>
                    )}
                </div>

                {/* Main Dynamic Area */}
                <div className="flex-1 overflow-y-auto py-6 space-y-4">
                    
                    {/* The Empty State Radar Animation */}
                    {isOnline && !hasActiveOrder && availableOrders.length === 0 && (
                        <div className="h-full flex items-center justify-center">
                            <div className="relative flex items-center justify-center">
                                <div className="absolute w-64 h-64 bg-blue-500/10 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
                                <div className="absolute w-40 h-40 bg-blue-500/20 rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: '0.3s' }}></div>
                                <div className="w-16 h-16 bg-blue-600 rounded-full shadow-lg shadow-blue-600/40 border-4 border-white flex items-center justify-center z-10">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* The Available Orders List */}
                    {isOnline && !hasActiveOrder && availableOrders.length > 0 && availableOrders.map((order) => (
                        <div key={order.id} className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 p-5 border border-slate-100 flex flex-col gap-4 animate-slide-up">
                            <div className="flex justify-between items-start">
                                <div className="flex flex-col pr-4">
                                    <span className="bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md mb-2 w-max">
                                        Ready for Pickup
                                    </span>
                                    <h3 className="text-lg font-extrabold text-slate-800 leading-tight">
                                        {order.restaurant?.name || "Restaurant"}
                                    </h3>
                                    <p className="text-sm font-medium text-slate-500 mt-1 flex items-start gap-1.5">
                                        <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span className="line-clamp-2">{order.restaurant?.fullAddress || "Pickup Location"}</span>
                                    </p>
                                </div>
                                <span className="text-2xl font-extrabold text-slate-800 shrink-0">₹{order.driverFee || 50}</span>
                            </div>
                            
                            <button 
                                onClick={() => handleAccept(order)} 
                                disabled={isClaiming}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-xl shadow-md shadow-blue-600/20 transition-transform active:scale-95 disabled:bg-blue-400"
                            >
                                {isClaiming ? "Claiming..." : "Accept Delivery"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}