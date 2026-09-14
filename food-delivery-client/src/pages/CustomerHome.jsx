import { useState } from "react";
import { CartProvider } from "../context/CartContext";
import GlobalHeader from "../components/GlobalHeader";
import HomeFeed from "../components/HomeFeed";
import RestaurantDetail from "../components/RestaurantDetail";
import CartDrawer from "../components/CartDrawer";


export default function CustomerHome() {
    // Acts as a pseudo-router until you install react-router-dom
    const [activeRestaurantId, setActiveRestaurantId] = useState(null);

    return (
        <CartProvider>
            <div className="min-h-screen bg-slate-50 font-sans">
                <GlobalHeader setActiveRestaurantId={setActiveRestaurantId} />
                
                {activeRestaurantId === null ? (
                    <HomeFeed setActiveRestaurantId={setActiveRestaurantId} />
                ) : (
                    <RestaurantDetail 
                        activeRestaurantId={activeRestaurantId} 
                        setActiveRestaurantId={setActiveRestaurantId} 
                    />
                )}
                
                <CartDrawer />
            </div>
        </CartProvider>
    );
}