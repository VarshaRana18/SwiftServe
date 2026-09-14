export const categories = [
    { id: 0, name: "All", emoji: "🍽️" },
    { id: 1, name: "Pizza", emoji: "🍕" },
    { id: 2, name: "Burgers", emoji: "🍔" },
    { id: 3, name: "Sushi", emoji: "🍣" },
    { id: 4, name: "Healthy", emoji: "🥗" },
    { id: 5, name: "Desserts", emoji: "🍰" }
];

export const promotions = [
    { id: 1, title: "50% OFF", subtitle: "On your first order", bg: "bg-gradient-to-r from-orange-500 to-red-500" },
    { id: 2, title: "Free Delivery", subtitle: "From top restaurants", bg: "bg-gradient-to-r from-teal-400 to-emerald-500" }
];

export const restaurants = [
    { id: 1, name: "Firehouse Grill", description: "Premium American diner serving legendary craft burgers.", address: "123 Main St, Vadodara", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop", rating: 4.8, time: "25-35 min", fee: "Free Delivery", tags: ["Burgers", "American"], isOpen: true },
    { id: 2, name: "Sakura Sushi", description: "Authentic Japanese sushi and hot ramen bowls.", address: "45 Asian Ave, Vadodara", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1000&auto=format&fit=crop", rating: 4.9, time: "40-50 min", fee: "₹49 Delivery", tags: ["Japanese", "Sushi"], isOpen: true },
    { id: 3, name: "Luigi's Oven", description: "Wood-fired Neapolitan pizzas.", address: "99 Italy Rd, Vadodara", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop", rating: 4.6, time: "30-45 min", fee: "₹35 Delivery", tags: ["Pizza", "Italian"], isOpen: false }
];

export const mockMenus = {
    1: [
        { id: 101, name: "Classic Cheeseburger", description: "Premium beef patty, aged cheddar, secret sauce.", price: 199, imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500&auto=format&fit=crop", isAvailable: true, stockQuantity: null, category: "Burgers" },
        { id: 103, name: "Truffle Burger", description: "Mushroom duxelles, truffle mayo, swiss cheese.", price: 249, imageUrl: "https://images.unsplash.com/photo-1594212202875-86ac1c618b14?q=80&w=500&auto=format&fit=crop", isAvailable: false, stockQuantity: 0, category: "Burgers" },
        { id: 102, name: "Large Fries", description: "Golden crinkle-cut fries with sea salt.", price: 99, imageUrl: "https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=500&auto=format&fit=crop", isAvailable: true, stockQuantity: 5, category: "Sides" },
        { id: 104, name: "Oreo Shake", description: "Thick hand-spun milkshake.", price: 149, imageUrl: null, isAvailable: true, stockQuantity: null, category: "Beverages" }
    ],
    2: [
        { id: 201, name: "Spicy Tuna Roll", description: "Fresh tuna, spicy mayo, cucumber.", price: 349, imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=500&auto=format&fit=crop", isAvailable: true, stockQuantity: null, category: "Sushi" }
    ]
};