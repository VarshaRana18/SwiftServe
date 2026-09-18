import { useState } from "react";
import DriverRadar from "../components/driver/DriverRadar";
import DriverRoute from "../components/driver/DriverRoute";
import DriverWallet from "../components/driver/DriverWallet";
import DriverSettings from "../components/driver/DriverSettings"; // NEW IMPORT

export default function DriverDashboard() {
    const [activeTab, setActiveTab] = useState("Radar");
    const [isOnline, setIsOnline] = useState(false);
    const [hasActiveOrder, setHasActiveOrder] = useState(false);

    const navItems = [
        { id: "Radar", icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" },
        { id: "Route", icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" },
        { id: "Wallet", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
        // NEW SETTINGS ICON
        { id: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c-.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c.94-1.543-.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" }
    ];

    return (
        <div className="h-screen bg-slate-50 flex flex-col font-sans overflow-hidden max-w-md mx-auto shadow-2xl relative border-x border-slate-200">
            
            {/* Top Header */}
            <header className="bg-white px-5 py-4 flex items-center justify-between shadow-sm z-20 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-slate-100 shrink-0">
                        <img src="https://ui-avatars.com/api/?name=Samiul+Shaikh&background=2563eb&color=fff&bold=true" alt="Driver" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-extrabold text-slate-800">Swift<span className="text-blue-600">Driver</span></span>
                        <span className="text-[10px] font-bold text-slate-400">ID: #D-849</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-full border border-slate-100">
                    <span className={`text-[10px] font-bold px-2 uppercase tracking-wide transition-colors ${isOnline ? 'text-blue-600' : 'text-slate-400'}`}>
                        {isOnline ? 'Online' : 'Offline'}
                    </span>
                    <button 
                        onClick={() => setIsOnline(!isOnline)}
                        disabled={hasActiveOrder} 
                        className={`w-12 h-6 rounded-full transition-colors relative shadow-inner shrink-0 ${isOnline ? 'bg-blue-600' : 'bg-slate-300'} ${hasActiveOrder ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow transition-transform ${isOnline ? 'translate-x-7' : 'translate-x-1'}`}></div>
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto bg-slate-50 pb-20 relative">
                {activeTab === "Radar" && (
                    <DriverRadar 
                        isOnline={isOnline} 
                        hasActiveOrder={hasActiveOrder}
                        onAcceptOrder={() => {
                            setHasActiveOrder(true);
                            setActiveTab("Route");
                        }} 
                    />
                )}
                
                {activeTab === "Route" && (
                    hasActiveOrder ? (
                        <DriverRoute 
                            onComplete={() => {
                                setHasActiveOrder(false);
                                setActiveTab("Radar");
                            }}
                            onCancel={() => {
                                setHasActiveOrder(false);
                                setActiveTab("Radar");
                            }}
                        />
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                            <div className="w-24 h-24 bg-slate-200 text-slate-400 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                            </div>
                            <h2 className="text-2xl font-extrabold text-slate-800 mb-2 tracking-tight">No Active Route</h2>
                            <p className="text-slate-500 font-medium text-sm mb-8">You don't currently have a delivery in progress. Head over to the Radar to find one.</p>
                            <button 
                                onClick={() => setActiveTab("Radar")} 
                                className="w-full max-w-[200px] bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold px-6 py-4 rounded-2xl transition-colors"
                            >
                                Open Radar
                            </button>
                        </div>
                    )
                )}

                {activeTab === "Wallet" && <DriverWallet />}
                {/* INJECT THE NEW COMPONENT HERE */}
                {activeTab === "Settings" && <DriverSettings />}
            </main>

            {/* Bottom Navigation */}
            <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-2 flex justify-between items-center z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                {navItems.map((item) => (
                    <button 
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                            activeTab === item.id ? 'text-blue-600' : 'text-slate-400 hover:text-blue-500'
                        }`}
                    >
                        <div className={`p-1.5 rounded-xl transition-colors ${activeTab === item.id ? 'bg-blue-50' : 'bg-transparent'}`}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === item.id ? "2.5" : "2"} d={item.icon} />
                            </svg>
                        </div>
                        <span className={`text-[10px] font-bold transition-all ${activeTab === item.id ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>{item.id}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
}