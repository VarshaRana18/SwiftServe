import { createContext, useContext, useState } from "react";
import { restaurants } from "../data/mockData";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    
    // 1. Cart Drawer State
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [activeCartView, setActiveCartView] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [confirmItemDeleteId, setConfirmItemDeleteId] = useState(null);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    
    // NEW: Lifted Location State
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [activeLocation, setActiveLocation] = useState("Select Location");

    // 2. Order Tracking State
    const [isOrdersOpen, setIsOrdersOpen] = useState(false);
    const [orderHistory, setOrderHistory] = useState([]);

    // 3. Settings & Profile State
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isVegOnly, setIsVegOnly] = useState(false);

    // 4. Cart Data State
    const [globalCarts, setGlobalCarts] = useState({});

    const updateQuantity = (restaurantId, itemId, delta) => {
        setGlobalCarts(prevCarts => {
            const targetCart = prevCarts[restaurantId];
            if (!targetCart) return prevCarts;
            const updatedItems = targetCart.items.map(item => item.id === itemId ? { ...item, qty: item.qty + delta } : item).filter(item => item.qty > 0);
            if (updatedItems.length === 0) {
                const newCarts = { ...prevCarts };
                delete newCarts[restaurantId];
                if (activeCartView === restaurantId) setActiveCartView(null);
                if (Object.keys(newCarts).length === 0) setIsCartOpen(false);
                return newCarts;
            }
            return { ...prevCarts, [restaurantId]: { ...targetCart, items: updatedItems } };
        });
        setConfirmItemDeleteId(null);
    };

    const addToCart = (restaurant, item) => {
    const resId = restaurant.id; // Extract the ID from the passed object
    
    setGlobalCarts(prevCarts => {
        const newCarts = { ...prevCarts };
        
        if (!newCarts[resId]) {
            // Build the new cart using the live database details passed from the component
            newCarts[resId] = { 
                restaurantId: resId, 
                restaurantName: restaurant.name, 
                image: restaurant.image, 
                items: [{ id: item.id, name: item.name, price: item.price, qty: 1 }] 
            };
        } else {
            const existingItemIndex = newCarts[resId].items.findIndex(i => i.id === item.id);
            if (existingItemIndex >= 0) {
                newCarts[resId].items[existingItemIndex].qty += 1;
            } else {
                newCarts[resId].items.push({ id: item.id, name: item.name, price: item.price, qty: 1 });
            }
        }
        return newCarts;
    });
};

    const deleteCart = (restaurantId) => {
        setGlobalCarts(prevCarts => {
            const newCarts = { ...prevCarts };
            delete newCarts[restaurantId];
            if (Object.keys(newCarts).length === 0) setIsCartOpen(false);
            return newCarts;
        });
        setConfirmDeleteId(null);
    };

    const getCartTotal = (restaurantId) => globalCarts[restaurantId]?.items.reduce((total, item) => total + (item.price * item.qty), 0) || 0;
    const getGrandTotal = () => Object.values(globalCarts).reduce((grandTotal, cart) => grandTotal + cart.items.reduce((sum, item) => sum + (item.price * item.qty), 0), 0);
    const getItemQtyInCart = (restaurantId, itemId) => {
        const cart = globalCarts[restaurantId];
        return cart?.items.find(i => i.id === itemId)?.qty || 0;
    };

    const checkoutCart = (cartId, tipAmount) => {
        const cartToOrder = globalCarts[cartId];
        if (!cartToOrder) return;
        const orderTotal = getCartTotal(cartId) + 10 + tipAmount;
        const newOrder = { orderId: `ORD-${Math.floor(Math.random() * 1000000)}`, timestamp: new Date().toISOString(), restaurantId: cartToOrder.restaurantId, restaurantName: cartToOrder.restaurantName, image: cartToOrder.image, items: [...cartToOrder.items], totalAmount: orderTotal, status: "Preparing" };
        setOrderHistory(prev => [newOrder, ...prev]);
        deleteCart(cartId);
    };

    return (
        <CartContext.Provider value={{
            isCartOpen, setIsCartOpen,
            activeCartView, setActiveCartView,
            confirmDeleteId, setConfirmDeleteId,
            confirmItemDeleteId, setConfirmItemDeleteId,
            selectedAddressId, setSelectedAddressId,
            isLocationModalOpen, setIsLocationModalOpen, // EXPORTED
            activeLocation, setActiveLocation,           // EXPORTED
            globalCarts,
            updateQuantity,
            addToCart,
            deleteCart,
            getCartTotal,
            getGrandTotal,
            getItemQtyInCart,
            isOrdersOpen, setIsOrdersOpen,
            orderHistory,
            checkoutCart,
            isSettingsOpen, setIsSettingsOpen,
            isVegOnly, setIsVegOnly
        }}>
            {children}
        </CartContext.Provider>
    );
};