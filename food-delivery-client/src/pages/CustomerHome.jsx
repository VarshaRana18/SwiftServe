import { useState, useEffect, useRef } from "react";
import { CartProvider } from "../context/CartContext";
import GlobalHeader from "../components/GlobalHeader";
import HomeFeed from "../components/HomeFeed";
import RestaurantDetail from "../components/RestaurantDetail";
import CartDrawer from "../components/CartDrawer";

export default function CustomerHome() {
    const [activeRestaurantId, setActiveRestaurantIdState] = useState(null);
    const homeScrollY = useRef(0);

    // UPDATED: Now talks to the Browser's History API
    const handleNavigate = (id) => {
        if (id !== null) {
            // Going INTO a restaurant
            homeScrollY.current = window.scrollY;
            setActiveRestaurantIdState(id);
            // Push a "fake" state to the browser so the Back button activates
            window.history.pushState({ isRestaurantOpen: true }, "");
        } else {
            // Going BACK home via the Logo button
            setActiveRestaurantIdState(null);
            // Clean up the browser history if they click the logo instead of the back button
            if (window.history.state?.isRestaurantOpen) {
                window.history.back();
            }
        }
    };

    // NEW: Intercept the physical Browser Back Button
    useEffect(() => {
        const handleBrowserBack = () => {
            // When the user hits Back, the browser pops the fake state.
            // We intercept it and force the app back to the Home Feed.
            setActiveRestaurantIdState(null);
        };

        window.addEventListener("popstate", handleBrowserBack);
        
        // Cleanup listener on unmount
        return () => window.removeEventListener("popstate", handleBrowserBack);
    }, []);

    // Handle physical scrolling after React state updates
    useEffect(() => {
        if (activeRestaurantId !== null) {
            window.scrollTo({ top: 0, behavior: "instant" });
        } else {
            window.scrollTo({ top: homeScrollY.current, behavior: "instant" });
        }
    }, [activeRestaurantId]);

    return (
        <CartProvider>
            <div className="min-h-screen bg-slate-50 font-sans">
                <GlobalHeader setActiveRestaurantId={handleNavigate} />
                
                {activeRestaurantId === null ? (
                    <HomeFeed setActiveRestaurantId={handleNavigate} />
                ) : (
                    <RestaurantDetail 
                        activeRestaurantId={activeRestaurantId} 
                        setActiveRestaurantId={handleNavigate} 
                    />
                )}
                
                <CartDrawer />
            </div>
        </CartProvider>
    );
}