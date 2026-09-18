import { useState, useEffect } from "react";

export default function DriverRadar({ isOnline, hasActiveOrder, onAcceptOrder }) {
    const [incomingOrder, setIncomingOrder] = useState(false);
    const [timer, setTimer] = useState(100);

    useEffect(() => {
        let pingTimeout;
        // FIX: Only trigger ping if they are online AND do not have an active order
        if (isOnline && !incomingOrder && !hasActiveOrder) {
            pingTimeout = setTimeout(() => {
                setIncomingOrder(true);
                setTimer(100);
            }, 3000);
        } else if (!isOnline || hasActiveOrder) {
            setIncomingOrder(false);
        }
        return () => clearTimeout(pingTimeout);
    }, [isOnline, incomingOrder, hasActiveOrder]);

    useEffect(() => {
        let countdown;
        if (incomingOrder) {
            countdown = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        clearInterval(countdown);
                        setIncomingOrder(false); 
                        return 0;
                    }
                    return prev - 1;
                });
            }, 100);
        }
        return () => clearInterval(countdown);
    }, [incomingOrder]);

    const handleDecline = () => setIncomingOrder(false);
    const handleAccept = () => {
        setIncomingOrder(false);
        onAcceptOrder(); 
    };

    return (
        <div className="h-full flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-50" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            <div className="relative z-10 flex flex-col h-full justify-between p-6">
                
                <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-white flex flex-col items-center text-center mt-2 transition-all">
                    {hasActiveOrder ? (
                        <>
                            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-3 shadow-sm">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <h2 className="font-extrabold text-slate-800 text-xl tracking-tight mb-1">Delivery in Progress</h2>
                            <p className="text-sm font-medium text-slate-500">Check the Route tab to complete it.</p>
                        </>
                    ) : isOnline ? (
                        <>
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3 animate-bounce shadow-sm">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                            </div>
                            <h2 className="font-extrabold text-slate-800 text-xl tracking-tight mb-1">Finding Orders...</h2>
                            <p className="text-sm font-medium text-slate-500">You are in a high-demand zone.</p>
                        </>
                    ) : (
                        <>
                            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-3">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h2 className="font-extrabold text-slate-800 text-xl tracking-tight mb-1">You are Offline</h2>
                            <p className="text-sm font-medium text-slate-500">Go online to start receiving delivery requests.</p>
                        </>
                    )}
                </div>

                <div className="flex-1 flex items-center justify-center">
                    {isOnline && !incomingOrder && !hasActiveOrder && (
                        <div className="relative flex items-center justify-center">
                            <div className="absolute w-64 h-64 bg-blue-500/10 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
                            <div className="absolute w-40 h-40 bg-blue-500/20 rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: '0.3s' }}></div>
                            <div className="w-16 h-16 bg-blue-600 rounded-full shadow-lg shadow-blue-600/40 border-4 border-white flex items-center justify-center z-10">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 flex justify-between items-center mb-6 opacity-90">
                    <div className="flex flex-col"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Earnings</span><span className="font-extrabold text-slate-800 text-xl">₹850</span></div>
                    <div className="w-px h-10 bg-slate-100"></div>
                    <div className="flex flex-col"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Deliveries</span><span className="font-extrabold text-slate-800 text-xl text-center">12</span></div>
                    <div className="w-px h-10 bg-slate-100"></div>
                    <div className="flex flex-col items-end"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Rating</span><span className="font-extrabold text-blue-600 text-xl flex items-center gap-1">4.9 <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg></span></div>
                </div>

            </div>

            {incomingOrder && (
                <div className="absolute inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex flex-col justify-end pb-6 px-4 animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl p-6 border-b-4 border-b-blue-600 transform translate-y-0 animate-[slideUp_0.3s_ease-out]">
                        <div className="flex justify-between items-start mb-4"><span className="bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg animate-pulse">New Request</span><span className="text-2xl font-extrabold text-slate-800">₹45</span></div>
                        <h3 className="text-xl font-extrabold text-slate-800 mb-1">Firehouse Grill</h3>
                        <p className="text-slate-500 font-medium text-sm mb-6 flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>2.4 km total distance</p>
                        <div className="grid grid-cols-2 gap-3 mb-4"><button onClick={handleDecline} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-2xl transition-colors">Decline</button><button onClick={handleAccept} className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 rounded-2xl shadow-lg shadow-blue-600/30 transition-transform active:scale-95">Accept</button></div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden"><div className={`h-1.5 rounded-full transition-all duration-100 ease-linear ${timer > 50 ? 'bg-blue-500' : timer > 25 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${timer}%` }}></div></div>
                    </div>
                </div>
            )}
        </div>
    );
}