import { useState } from "react";
import VendorOrders from "../components/vendor/VendorOrders";
import VendorMenu from "../components/vendor/VendorMenu";
import VendorSettings from "../components/vendor/VendorSettings";

export default function VendorDashboard() {
    const [activeTab, setActiveTab] = useState("Orders");
    const [isAcceptingOrders, setIsAcceptingOrders] = useState(true);
    
    const navItems = [
        { name: "Orders", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
        { name: "Menu", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
        { name: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c-.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c.94-1.543-.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" }
    ];

    return (
        <div className="h-screen bg-slate-50 flex flex-col lg:flex-row font-sans overflow-hidden">
            {/* MOBILE HEADER */}
            <div className="lg:hidden flex flex-col shrink-0 bg-white border-b border-slate-200 z-30">
                <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
                    <span className="text-xl font-extrabold text-slate-800">Swift<span className="text-teal-600">Partner</span></span>
                    <div className="flex items-center gap-2 bg-slate-50 py-1.5 px-2 rounded-xl border border-slate-100">
                        <span className={`text-xs font-bold transition-colors ${isAcceptingOrders ? 'text-teal-600' : 'text-red-500'}`}>{isAcceptingOrders ? 'Accepting' : 'Closed'}</span>
                        <button onClick={() => setIsAcceptingOrders(!isAcceptingOrders)} className={`w-12 h-6 rounded-full transition-colors relative shadow-inner shrink-0 ${isAcceptingOrders ? 'bg-teal-500' : 'bg-slate-300'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow transition-transform ${isAcceptingOrders ? 'translate-x-7' : 'translate-x-1'}`}></div>
                        </button>
                    </div>
                </div>
                <div className="flex overflow-x-auto scrollbar-hide px-2">
                    {navItems.map((item) => (
                        <button key={item.name} onClick={() => setActiveTab(item.name)} className={`flex items-center gap-2 py-3 px-4 whitespace-nowrap font-bold text-sm transition-colors ${activeTab === item.name ? 'text-teal-600 border-b-2 border-teal-500' : 'text-slate-500 hover:text-teal-600'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} /></svg>
                            {item.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* DESKTOP SIDEBAR */}
            <aside className="w-52 bg-white border-r border-slate-100 flex-col hidden lg:flex shrink-0">
                <div className="h-20 flex items-center px-6 border-b border-slate-100">
                    <span className="text-xl font-extrabold text-slate-800">Swift<span className="text-teal-600">Partner</span></span>
                </div>
                <div className="p-4 flex-1">
                    <div className="space-y-1">
                        {navItems.map((item) => (
                            <button key={item.name} onClick={() => setActiveTab(item.name)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${activeTab === item.name ? 'bg-teal-50 text-teal-600' : 'text-slate-500 hover:bg-slate-50 hover:text-teal-600'}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} /></svg>
                                {item.name}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-slate-200 shrink-0">
                            <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=100&auto=format&fit=crop" alt="Restaurant" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-bold text-slate-800 truncate">Firehouse Grill</span>
                            <span className="text-xs font-medium text-slate-500">ID: #8472</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                <header className="h-20 bg-white border-b border-slate-100 hidden lg:flex items-center justify-between px-6 shrink-0">
                    <h1 className="text-2xl font-bold text-slate-800">{activeTab}</h1>
                    <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                        <span className={`text-sm font-bold px-3 transition-colors ${isAcceptingOrders ? 'text-slate-400' : 'text-red-500'}`}>Closed</span>
                        <button onClick={() => setIsAcceptingOrders(!isAcceptingOrders)} className={`w-14 h-7 rounded-full transition-colors relative shadow-inner ${isAcceptingOrders ? 'bg-teal-500' : 'bg-slate-300'}`}>
                            <div className={`w-5 h-5 bg-white rounded-full absolute top-1 shadow transition-transform ${isAcceptingOrders ? 'translate-x-8' : 'translate-x-1'}`}></div>
                        </button>
                        <span className={`text-sm font-bold px-3 transition-colors ${isAcceptingOrders ? 'text-teal-600' : 'text-slate-400'}`}>Accepting</span>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50">
                    {activeTab === "Orders" && <VendorOrders />}
                    {activeTab === "Menu" && <VendorMenu />}
                    {activeTab === "Settings" && <VendorSettings />}
                </div>
            </main>
        </div>
    );
}