import { useState } from "react";

export default function DriverRoute({ activeOrder, onComplete }) {
    // Phase 1: Driving to Restaurant (Pickup)
    // Phase 2: Driving to Customer (Delivery)
    const [routePhase, setRoutePhase] = useState("pickup");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleAction = async () => {
        if (!activeOrder) return;
        setIsProcessing(true);

        try {
            const token = localStorage.getItem('token');
            
            if (routePhase === "pickup") {
                const response = await fetch(`http://localhost:5121/api/driver/${activeOrder.id}/status`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ status: 3 }) 
                });

                if (response.ok) {
                    setRoutePhase("delivery");
                }
            } 
            else if (routePhase === "delivery") {
                const response = await fetch(`http://localhost:5121/api/driver/${activeOrder.id}/status`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ status: 4 }) 
                });

                if (response.ok) {
                    setRoutePhase("completed");
                }
            }
        } catch (error) {
            console.error("Failed to update delivery status:", error);
            alert("Network error. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (routePhase === "completed") {
        return (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center animate-fade-in bg-white">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-800 mb-2 tracking-tight">Delivered!</h2>
                <p className="text-slate-500 font-medium mb-10 text-lg">
                    {/* FIX: Hardcoded fallback updated from 45 to 50 */}
                    You earned <span className="text-green-600 font-bold">₹{activeOrder?.driverFee || 50}</span> for this trip.
                </p>
                <button onClick={onComplete} className="w-full bg-slate-100 text-slate-700 font-bold px-8 py-4 rounded-2xl shadow-sm hover:bg-slate-200 transition-colors">
                    Find Next Order
                </button>
            </div>
        );
    }

    // Dynamic UI resolution: Anonymize the customer name for privacy
    const destName = routePhase === "pickup" 
        ? activeOrder?.restaurant?.name || "Restaurant" 
        : "Customer Drop-off";

    // Use Vadodara as the fallback location
    const rawDestination = routePhase === "pickup" 
        ? activeOrder?.restaurant?.fullAddress || activeOrder?.restaurant?.city || "Vadodara" 
        : activeOrder?.address?.fullAddress || "Customer Delivery Address, Vadodara";

    const mapDestination = encodeURIComponent(rawDestination);

    return (
        <div className="h-full flex flex-col p-6 animate-fade-in bg-slate-50 justify-center">
            
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 border border-slate-100 w-full">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2 mb-3">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md inline-block ${routePhase === "pickup" ? "text-orange-600 bg-orange-50" : "text-blue-600 bg-blue-50"}`}>
                                {routePhase === "pickup" ? "Step 1: Pick Up" : "Step 2: Drop Off"}
                            </span>
                            {routePhase === "pickup" && (
                                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md uppercase tracking-wider">
                                    Ready
                                </span>
                            )}
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-800 leading-tight">
                            {destName}
                        </h2>
                        <p className="text-sm font-medium text-slate-500 mt-1 line-clamp-2">
                            {rawDestination}
                        </p>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                        {/* FIX: Hardcoded fallback updated from 45 to 50 */}
                        <span className="text-2xl font-extrabold text-slate-800">₹{activeOrder?.driverFee || 50}</span>
                        <span className="text-sm font-bold text-slate-400">2.4 km</span>
                    </div>
                </div>

                <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${mapDestination}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-700 font-bold py-3 rounded-xl mb-8 hover:bg-blue-100 transition-colors border border-blue-100"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Open in Google Maps
                </a>

                <div className="space-y-3">
                    <button 
                        onClick={handleAction}
                        disabled={isProcessing}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-lg py-4 rounded-2xl shadow-lg shadow-blue-600/30 transition-transform active:scale-[0.98] flex justify-center items-center gap-2 disabled:bg-blue-400"
                    >
                        {isProcessing ? "Updating..." : (routePhase === "pickup" ? "Confirm Pickup" : "Complete Delivery")}
                        {!isProcessing && (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}