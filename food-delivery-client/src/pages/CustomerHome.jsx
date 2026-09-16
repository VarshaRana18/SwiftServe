import { useState, useEffect, useRef } from "react";
// Make sure this path is correct based on where CustomerHome is located now!
import { CartProvider } from "../context/CartContext"; 
import GlobalHeader from "../components/GlobalHeader";
import HomeFeed from "../components/HomeFeed";
import RestaurantDetail from "../components/RestaurantDetail";
import CartDrawer from "../components/CartDrawer";
import SettingsModal from "../components/SettingsModal"; 

export default function CustomerHome() {
    // Completely removed the mock isLoggedIn state
    
    const [activeRestaurantId, setActiveRestaurantIdState] = useState(null);
    const homeScrollY = useRef(0);

    const handleNavigate = (id) => {
        if (id !== null) {
            homeScrollY.current = window.scrollY;
            setActiveRestaurantIdState(id);
            window.history.pushState({ isRestaurantOpen: true }, "");
        } else {
            setActiveRestaurantIdState(null);
            if (window.history.state?.isRestaurantOpen) {
                window.history.back();
            }
        }
    };

    useEffect(() => {
        const handleBrowserBack = () => {
            setActiveRestaurantIdState(null);
        };
        window.addEventListener("popstate", handleBrowserBack);
        return () => window.removeEventListener("popstate", handleBrowserBack);
    }, []);

    useEffect(() => {
        if (activeRestaurantId !== null) {
            window.scrollTo({ top: 0, behavior: "instant" });
        } else {
            window.scrollTo({ top: homeScrollY.current, behavior: "instant" });
        }
    }, [activeRestaurantId]);

    // Just return the clean, authenticated app shell
    return (
        <CartProvider>
            <div className="min-h-screen bg-slate-50 font-sans relative">
                <GlobalHeader setActiveRestaurantId={handleNavigate} />
                
                {activeRestaurantId === null ? (
                    <HomeFeed setActiveRestaurantId={handleNavigate} />
                ) : (
                    <RestaurantDetail activeRestaurantId={activeRestaurantId} setActiveRestaurantId={handleNavigate} />
                )}
                
                <CartDrawer />
                {/* Notice we no longer need to pass setIsLoggedIn down */}
                <SettingsModal /> 
            </div>
        </CartProvider>
    );
}