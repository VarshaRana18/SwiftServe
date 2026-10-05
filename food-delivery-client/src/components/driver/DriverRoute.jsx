import { useState } from "react";

export default function DriverRoute({ onComplete, onCancel }) {
    const [routePhase, setRoutePhase] = useState("pickup"); 

    const handleAction = () => {
        if (routePhase === "pickup") setRoutePhase("delivery");
        else if (routePhase === "delivery") setRoutePhase("completed");
    };

    if (routePhase === "completed") {
        return (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center animate-fade-in bg-white">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-800 mb-2 tracking-tight">Delivered!</h2>
                <p className="text-slate-500 font-medium mb-10 text-lg">You earned <span className="text-green-600 font-bold">₹45</span> for this trip.</p>
                <button 
                    onClick={onComplete}
                    className="w-full bg-slate-100 text-slate-700 font-bold px-8 py-4 rounded-2xl shadow-sm hover:bg-slate-200 transition-colors"
                >
                    Find Next Order
                </button>
            </div>
        );
    }

    // Dynamic destination for the Google Maps URI
    const mapDestination = routePhase === "pickup" 
        ? "123+Burger+Lane" 
        : "404+Sky+Towers"; 

    return (
        <div className="h-full flex flex-col p-6 animate-fade-in bg-slate-50 justify-center">
            
            {/* Centered Mission Card */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 border border-slate-100 w-full">
                
                <div className="flex justify-between items-start mb-6">
                    <div className="flex-1 pr-4">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md mb-3 inline-block ${routePhase === "pickup" ? "text-orange-600 bg-orange-50" : "text-blue-600 bg-blue-50"}`}>
                            {routePhase === "pickup" ? "Step 1: Pick Up" : "Step 2: Drop Off"}
                        </span>
                        <h2 className="text-2xl font-extrabold text-slate-800 leading-tight">{routePhase === "pickup" ? "Firehouse Grill" : "Aditi Sharma"}</h2>
                        <p className="text-sm font-medium text-slate-500 mt-1 line-clamp-2">{routePhase === "pickup" ? "123 Burger Lane, Food District" : "404 Sky Towers, North Wing"}</p>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                        <span className="text-2xl font-extrabold text-slate-800">₹45</span>
                        <span className="text-sm font-bold text-slate-400">2.4 km</span>
                    </div>
                </div>

                {/* Google Maps Deep Link Button */}
                <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${mapDestination}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-700 font-bold py-3 rounded-xl mb-6 hover:bg-blue-100 transition-colors border border-blue-100"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Open in Google Maps
                </a>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-slate-700">Order #ORD-8901</span>
                        {routePhase === "pickup" && (
                            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">Food is Ready</span>
                        )}
                    </div>
                    <p className="text-xs font-medium text-slate-500">1x Truffle Burger, 1x Fries</p>
                </div>

                <div className="space-y-3">
                    <button onClick={handleAction} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-lg py-4 rounded-2xl shadow-lg shadow-blue-600/30 transition-transform active:scale-[0.98] flex justify-center items-center gap-2">
                        {routePhase === "pickup" ? "Confirm Pickup" : "Complete Delivery"}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                    </button>
                    
                    <button onClick={onCancel} className="w-full py-2 text-sm font-bold text-slate-400 hover:text-red-500 transition-colors">
                        Report Issue / Cancel Delivery
                    </button>
                </div>
            </div>
        </div>
    );
}