import { useState, useEffect } from "react";

export default function DriverWallet() {
    const [deliveries, setDeliveries] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Fixed MVP Payout Rate
    const payoutPerDelivery = 50;

    useEffect(() => {
        const fetchDeliveries = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch("http://localhost:5121/api/driver/history", {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setDeliveries(data);
                }
            } catch (error) {
                console.error("Failed to fetch delivery history:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDeliveries();
    }, []);

    // MVP Math logic based on the IsDriverSettled backend flag
    const unsettledDeliveries = deliveries.filter(d => !d.isDriverSettled);
    const pendingPayout = unsettledDeliveries.length * payoutPerDelivery;
    const lifetimeEarnings = deliveries.length * payoutPerDelivery;

    return (
        <div className="p-6 animate-fade-in pb-24">
            
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-extrabold text-slate-800">Earnings</h2>
            </div>

            {/* Main Balance Card */}
            <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-600/30 mb-6 relative overflow-hidden shrink-0">
                <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>
                
                <div className="relative z-10 flex flex-col items-center text-center">
                    <span className="text-blue-100 text-sm font-bold uppercase tracking-wider mb-1">Pending Payout</span>
                    <div className="text-5xl font-extrabold tracking-tight mb-3">₹{pendingPayout}</div>
                    <div className="bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md">
                        {unsettledDeliveries.length} Unpaid Trips
                    </div>
                </div>
            </div>

            {/* Lifetime Stats */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-8 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Lifetime Earnings</span>
                <span className="text-lg font-extrabold text-slate-800">₹{lifetimeEarnings}</span>
            </div>

            {/* Trip History List */}
            <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-1">Delivery History</h3>
                
                {isLoading ? (
                    <div className="text-center text-slate-400 font-medium py-8">Loading history...</div>
                ) : deliveries.length === 0 ? (
                    <div className="text-center text-slate-400 font-medium py-8 bg-slate-100/50 rounded-2xl border border-slate-100 border-dashed">
                        No completed deliveries yet.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {deliveries.map((trip) => {
                            const timeString = trip.updatedAt || trip.createdAt 
                                ? new Date(trip.updatedAt || trip.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                                : "Completed";

                            return (
                                <div key={trip.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-blue-50 rounded-full border border-blue-100 flex items-center justify-center shrink-0">
                                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-800 text-sm line-clamp-1">
                                                {trip.restaurant?.name || `Order #${trip.id.substring(0, 8).toUpperCase()}`}
                                            </span>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-xs font-medium text-slate-400">
                                                    {timeString}
                                                </span>
                                                {trip.isDriverSettled ? (
                                                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded uppercase">Paid</span>
                                                ) : (
                                                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded uppercase">Pending</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`font-extrabold ${trip.isDriverSettled ? 'text-slate-400' : 'text-blue-600'}`}>
                                        +₹{payoutPerDelivery}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}