export default function DriverWallet() {
    // Mock delivery history - Added a few more to test the full-page scroll
    const recentTrips = [
        { id: "ORD-8898", time: "2:14 PM", distance: "3.2 km", earning: "₹65", status: "Completed" },
        { id: "ORD-8885", time: "1:30 PM", distance: "1.8 km", earning: "₹45", status: "Completed" },
        { id: "ORD-8872", time: "12:45 PM", distance: "4.5 km", earning: "₹85", status: "Completed" },
        { id: "ORD-8860", time: "11:20 AM", distance: "2.1 km", earning: "₹50", status: "Completed" },
        { id: "ORD-8845", time: "10:05 AM", distance: "3.8 km", earning: "₹75", status: "Completed" },
        { id: "ORD-8830", time: "9:15 AM", distance: "1.5 km", earning: "₹40", status: "Completed" },
    ];

    return (
        /* Removed h-full and flex constraints so it flows naturally */
        <div className="p-6 animate-fade-in">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-extrabold text-slate-800">Earnings</h2>
                <select className="bg-slate-100 border-none text-sm font-bold text-slate-600 rounded-lg py-2 px-3 focus:ring-0 cursor-pointer outline-none">
                    <option>Today</option>
                    <option>This Week</option>
                    <option>This Month</option>
                </select>
            </div>

            {/* Main Balance Card */}
            <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-600/30 mb-6 relative overflow-hidden shrink-0">
                <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>
                
                <div className="relative z-10">
                    <span className="text-blue-100 text-sm font-bold uppercase tracking-wider mb-1 block">Net Payout</span>
                    <div className="text-5xl font-extrabold tracking-tight mb-4">₹850</div>
                    
                    <div className="flex items-center justify-between border-t border-white/20 pt-4 mt-2">
                        <div className="flex flex-col">
                            <span className="text-blue-200 text-xs font-semibold">Active Time</span>
                            <span className="font-bold">4h 20m</span>
                        </div>
                        <div className="w-px h-8 bg-white/20"></div>
                        <div className="flex flex-col">
                            <span className="text-blue-200 text-xs font-semibold">Trips</span>
                            <span className="font-bold text-center">12</span>
                        </div>
                        <div className="w-px h-8 bg-white/20"></div>
                        <div className="flex flex-col items-end">
                            <span className="text-blue-200 text-xs font-semibold">Tips</span>
                            <span className="font-bold">₹120</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Daily Goal Progress */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-6 shrink-0">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-slate-700">Daily Goal</span>
                    <span className="text-xs font-bold text-slate-400">₹850 / ₹1000</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div className="bg-blue-500 h-3 rounded-full transition-all duration-1000" style={{ width: '85%' }}></div>
                </div>
            </div>

            {/* Trip History List - Now scrolls with the page */}
            <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-1">Recent Trips</h3>
                <div className="space-y-3">
                    {recentTrips.map((trip, index) => (
                        <div key={index} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-50 rounded-full border border-slate-100 flex items-center justify-center shrink-0">
                                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-slate-800 text-sm">{trip.id}</span>
                                    <span className="text-xs font-medium text-slate-400">{trip.time} • {trip.distance}</span>
                                </div>
                            </div>
                            <span className="font-extrabold text-blue-600">{trip.earning}</span>
                        </div>
                    ))}
                </div>
            </div>
            
        </div>
    );
}