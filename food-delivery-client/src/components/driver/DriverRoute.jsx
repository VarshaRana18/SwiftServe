import { useState } from "react";

export default function DriverRoute() {
    // Route State Engine
    const [routePhase, setRoutePhase] = useState("pickup"); // 'pickup', 'delivery', 'completed'

    const handleAction = () => {
        if (routePhase === "pickup") setRoutePhase("delivery");
        else if (routePhase === "delivery") setRoutePhase("completed");
    };

    // The Success Screen
    if (routePhase === "completed") {
        return (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center animate-fade-in bg-white">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-800 mb-2 tracking-tight">Delivered!</h2>
                <p className="text-slate-500 font-medium mb-10 text-lg">You earned <span className="text-green-600 font-bold">₹45</span> for this trip.</p>
                <button onClick={() => setRoutePhase("pickup")} className="w-full bg-slate-100 text-slate-700 font-bold px-8 py-4 rounded-2xl shadow-sm hover:bg-slate-200 transition-colors">
                    Find Next Order
                </button>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* The Map Interface */}
            <div className="flex-1 bg-slate-200 relative overflow-hidden flex items-center justify-center">
                {/* CSS Grid Pattern for Map Illusion */}
                <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                
                {/* Animated Route Line */}
                <svg className="absolute w-full h-full inset-0 z-0" style={{ filter: 'drop-shadow(0 4px 6px rgba(37,99,235,0.3))' }}>
                    <path d="M 50 100 Q 200 50 350 250" fill="none" stroke="#2563eb" strokeWidth="6" strokeLinecap="round" strokeDasharray="12 12" className="animate-pulse" />
                </svg>

                {/* Origin Pin */}
                <div className="absolute top-1/4 left-1/4 w-6 h-6 bg-slate-800 rounded-full border-4 border-white shadow-lg flex items-center justify-center z-10">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                
                {/* Destination Pin */}
                <div className="absolute bottom-1/3 right-1/4 w-10 h-10 bg-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center z-10">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
            </div>

            {/* The Mission Bottom Sheet */}
            <div className="bg-white rounded-t-3xl shadow-[0_-15px_40px_rgba(0,0,0,0.1)] relative z-20 -mt-6 p-6 pb-8 border-t border-slate-100">
                {/* Drag Handle Indicator */}
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
                
                <div className="flex justify-between items-start mb-6">
                    <div className="flex-1 pr-4">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md mb-2 inline-block ${routePhase === "pickup" ? "text-orange-600 bg-orange-50" : "text-blue-600 bg-blue-50"}`}>
                            {routePhase === "pickup" ? "Step 1: Pick Up" : "Step 2: Drop Off"}
                        </span>
                        <h2 className="text-2xl font-extrabold text-slate-800 leading-tight">
                            {routePhase === "pickup" ? "Firehouse Grill" : "Aditi Sharma"}
                        </h2>
                        <p className="text-sm font-medium text-slate-500 mt-1 line-clamp-2">
                            {routePhase === "pickup" ? "123 Burger Lane, Food District" : "404 Sky Towers, North Wing"}
                        </p>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                        <span className="text-2xl font-extrabold text-slate-800">₹45</span>
                        <span className="text-sm font-bold text-slate-400">2.4 km</span>
                    </div>
                </div>

                {/* Order Details Card */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-slate-700">Order #ORD-8901</span>
                        {routePhase === "pickup" && (
                            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">Food is Ready</span>
                        )}
                    </div>
                    <p className="text-xs font-medium text-slate-500">1x Truffle Burger, 1x Fries</p>
                </div>

                {/* Master Action Button */}
                <button 
                    onClick={handleAction}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-lg py-4 rounded-2xl shadow-lg shadow-blue-600/30 transition-transform active:scale-[0.98] flex justify-center items-center gap-2"
                >
                    {routePhase === "pickup" ? "Confirm Pickup" : "Complete Delivery"}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>
        </div>
    );
}