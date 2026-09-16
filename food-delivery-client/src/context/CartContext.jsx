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

    // 2. Order Tracking State
    const [isOrdersOpen, setIsOrdersOpen] = useState(false);
    const [orderHistory, setOrderHistory] = useState([]);

    // 3. NEW: Settings & Profile State
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isVegOnly, setIsVegOnly] = useState(false);
    const [userProfile, setUserProfile] = useState({
        name: "Samiul Shaikh",
        email: "samiul@example.com",
        phone: "+91 98765 43210"
    });

    // 4. Cart Data State
    const [globalCarts, setGlobalCarts] = useState({
        "1": {
            restaurantId: 1,
            restaurantName: "Firehouse Grill",
            image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=100&auto=format&fit=crop",
            items: [
                { id: 101, name: "Classic Cheeseburger", price: 199, qty: 2 },
                { id: 102, name: "Large Fries", price: 99, qty: 1 }
            ]
        }
    });

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

    const addToCart = (restaurantId, item) => {
        setGlobalCarts(prevCarts => {
            const newCarts = { ...prevCarts };
            if (!newCarts[restaurantId]) {
                const restInfo = restaurants.find(r => r.id === restaurantId);
                newCarts[restaurantId] = {
                    restaurantId: restInfo.id,
                    restaurantName: restInfo.name,
                    image: restInfo.image,
                    items: [{ id: item.id, name: item.name, price: item.price, qty: 1 }]
                };
            } else {
                const existingItemIndex = newCarts[restaurantId].items.findIndex(i => i.id === item.id);
                if (existingItemIndex >= 0) {
                    newCarts[restaurantId].items[existingItemIndex].qty += 1;
                } else {
                    newCarts[restaurantId].items.push({ id: item.id, name: item.name, price: item.price, qty: 1 });
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
        const newOrder = {
            orderId: `ORD-${Math.floor(Math.random() * 1000000)}`,
            timestamp: new Date().toISOString(),
            restaurantId: cartToOrder.restaurantId,
            restaurantName: cartToOrder.restaurantName,
            image: cartToOrder.image,
            items: [...cartToOrder.items],
            totalAmount: orderTotal,
            status: "Preparing"
        };
        setOrderHistory(prev => [newOrder, ...prev]);
        deleteCart(cartId);
    };

    return (
        <CartContext.Provider value={{
            isCartOpen, setIsCartOpen, activeCartView, setActiveCartView,
            confirmDeleteId, setConfirmDeleteId, confirmItemDeleteId, setConfirmItemDeleteId,
            globalCarts, updateQuantity, addToCart, deleteCart,
            getCartTotal, getGrandTotal, getItemQtyInCart,
            isOrdersOpen, setIsOrdersOpen, orderHistory, checkoutCart,
            isSettingsOpen, setIsSettingsOpen, isVegOnly, setIsVegOnly, userProfile, setUserProfile
        }}>
            {children}
        </CartContext.Provider>
    );
};