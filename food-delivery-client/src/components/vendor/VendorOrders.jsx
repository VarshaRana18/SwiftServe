import { useState } from "react";

const initialOrders = [
    { id: "ORD-8901", items: "1x Truffle Burger, 1x Fries", total: "₹348", status: "Incoming", time: "2 mins ago" },
    { id: "ORD-8902", items: "2x Spicy Paneer Burger", total: "₹438", status: "Incoming", time: "Just now" },
    { id: "ORD-8899", items: "1x Classic Cheeseburger, 1x Shake", total: "₹348", status: "Preparing", time: "10 mins ago" },
    { id: "ORD-8898", items: "3x Bacon Double Smash", total: "₹1047", status: "Ready", time: "15 mins ago" },
];

export default function VendorOrders() {
    const [orders, setOrders] = useState(initialOrders);
    const [mobileOrderTab, setMobileOrderTab] = useState("Incoming");

    const updateOrderStatus = (orderId, newStatus) => {
        setOrders(prevOrders => prevOrders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
        if (window.innerWidth < 1024) setMobileOrderTab(newStatus);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="lg:hidden flex bg-slate-200/50 p-1 rounded-xl mb-4 shrink-0">
                {["Incoming", "Preparing", "Ready"].map(tab => (
                    <button key={tab} onClick={() => setMobileOrderTab(tab)} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${mobileOrderTab === tab ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                        {tab} ({orders.filter(o => o.status === tab).length})
                    </button>
                ))}
            </div>
            <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-x-auto pb-4">
                {/* Incoming */}
                <div className={`flex-1 flex-col bg-slate-100/50 rounded-3xl p-4 border border-slate-200/60 min-w-[280px] lg:min-w-[320px] ${mobileOrderTab === "Incoming" ? "flex" : "hidden lg:flex"}`}>
                    <div className="flex items-center justify-between mb-4 px-2 shrink-0">
                        <h2 className="font-bold text-slate-700 flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>Incoming</h2>
                        <span className="bg-white text-slate-500 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm hidden lg:inline-block">{orders.filter(o => o.status === "Incoming").length}</span>
                    </div>
                    <div className="space-y-4 overflow-y-auto pr-1 flex-1 pb-20 lg:pb-0">
                        {orders.filter(o => o.status === "Incoming").map(order => (
                            <div key={order.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                                <div className="flex justify-between items-start mb-3"><span className="font-bold text-slate-800">{order.id}</span><span className="text-xs font-medium text-slate-400">{order.time}</span></div>
                                <p className="text-sm font-medium text-slate-600 mb-6">{order.items}</p>
                                <div className="flex flex-wrap items-center justify-between gap-3"><span className="font-bold text-teal-600 text-lg">{order.total}</span><button onClick={() => updateOrderStatus(order.id, "Preparing")} className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors shadow-sm shrink-0">Accept</button></div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Preparing */}
                <div className={`flex-1 flex-col bg-slate-100/50 rounded-3xl p-4 border border-slate-200/60 min-w-[280px] lg:min-w-[320px] ${mobileOrderTab === "Preparing" ? "flex" : "hidden lg:flex"}`}>
                    <div className="flex items-center justify-between mb-4 px-2 shrink-0">
                        <h2 className="font-bold text-slate-700 flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>Preparing</h2>
                        <span className="bg-white text-slate-500 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm hidden lg:inline-block">{orders.filter(o => o.status === "Preparing").length}</span>
                    </div>
                    <div className="space-y-4 overflow-y-auto pr-1 flex-1 pb-20 lg:pb-0">
                        {orders.filter(o => o.status === "Preparing").map(order => (
                            <div key={order.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-yellow-400">
                                <div className="flex justify-between items-start mb-3"><span className="font-bold text-slate-800">{order.id}</span><span className="text-xs font-medium text-slate-400">{order.time}</span></div>
                                <p className="text-sm font-medium text-slate-600 mb-6">{order.items}</p>
                                <div className="flex flex-wrap items-center justify-between gap-3"><span className="font-bold text-slate-400 line-through decoration-slate-300 text-lg">{order.total}</span><button onClick={() => updateOrderStatus(order.id, "Ready")} className="bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-200 text-slate-700 hover:text-teal-700 text-sm font-bold px-6 py-2.5 rounded-xl transition-colors shrink-0">Ready</button></div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Ready */}
                <div className={`flex-1 flex-col bg-slate-100/50 rounded-3xl p-4 border border-slate-200/60 min-w-[280px] lg:min-w-[320px] ${mobileOrderTab === "Ready" ? "flex" : "hidden lg:flex"}`}>
                    <div className="flex items-center justify-between mb-4 px-2 shrink-0">
                        <h2 className="font-bold text-slate-700 flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>Ready for Pickup</h2>
                        <span className="bg-white text-slate-500 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm hidden lg:inline-block">{orders.filter(o => o.status === "Ready").length}</span>
                    </div>
                    <div className="space-y-4 overflow-y-auto pr-1 flex-1 pb-20 lg:pb-0">
                        {orders.filter(o => o.status === "Ready").map(order => (
                            <div key={order.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-green-400 opacity-75">
                                <div className="flex justify-between items-start mb-3"><span className="font-bold text-slate-800">{order.id}</span><span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md">Awaiting Driver</span></div>
                                <p className="text-sm font-medium text-slate-500 mb-6">{order.items}</p>
                                <div className="flex flex-wrap items-center justify-between gap-3"><span className="font-bold text-slate-400 line-through decoration-slate-300 text-lg">{order.total}</span><div className="bg-slate-50 border border-slate-200 text-slate-400 text-sm font-bold px-6 py-2.5 rounded-xl text-center shrink-0">Sealed</div></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}