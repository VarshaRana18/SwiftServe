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
    { 
        id: 1, name: "Firehouse Grill", description: "Premium American diner serving legendary craft burgers.", address: "123 Main St, Vadodara", 
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop", 
        rating: 4.8, time: "25-35 min", fee: "Free Delivery", tags: ["Burgers", "American"], isOpen: true 
    },
    { 
        id: 2, name: "Sakura Sushi", description: "Authentic Japanese sushi and hot ramen bowls.", address: "45 Asian Ave, Vadodara", 
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1000&auto=format&fit=crop", 
        rating: 4.9, time: "40-50 min", fee: "₹49 Delivery", tags: ["Japanese", "Sushi"], isOpen: true 
    },
    { 
        id: 3, name: "Luigi's Oven", description: "Wood-fired Neapolitan pizzas.", address: "99 Italy Rd, Vadodara", 
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop", 
        rating: 4.6, time: "30-45 min", fee: "₹35 Delivery", tags: ["Pizza", "Italian"], isOpen: false 
    },
    { 
        id: 4, name: "Green Bowl", description: "Fresh, organic salads and protein-packed smoothie bowls.", address: "Alkapuri, Vadodara", 
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop", 
        rating: 4.7, time: "15-25 min", fee: "Free Delivery", tags: ["Healthy", "Vegan"], isOpen: true 
    },
    { 
        id: 5, name: "Sugar Rush Bakery", description: "Decadent cakes, pastries, and artisanal coffee.", address: "Fatehgunj, Vadodara", 
        image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=1000&auto=format&fit=crop", 
        rating: 4.5, time: "20-30 min", fee: "₹20 Delivery", tags: ["Desserts", "Bakery"], isOpen: true 
    },
    { 
        id: 6, name: "Burger Cartel", description: "Smashed patties with secret house sauces.", address: "Akota, Vadodara", 
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop", 
        rating: 4.3, time: "30-40 min", fee: "₹30 Delivery", tags: ["Burgers", "Fast Food"], isOpen: true 
    },
    { 
        id: 7, name: "Spice Route", description: "Rich North Indian curries and tandoori specials.", address: "Gotri, Vadodara", 
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=1000&auto=format&fit=crop", 
        rating: 4.8, time: "45-55 min", fee: "Free Delivery", tags: ["Indian", "Curry"], isOpen: true 
    },
    { 
        id: 8, name: "Slice Society", description: "New York style massive pizza slices.", address: "Karelibaug, Vadodara", 
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1000&auto=format&fit=crop", 
        rating: 4.4, time: "25-35 min", fee: "₹40 Delivery", tags: ["Pizza", "Fast Food"], isOpen: true 
    },
    { 
        id: 9, name: "Zen Noodles", description: "Pan-Asian wok bowls and handmade dim sum.", address: "Sama, Vadodara", 
        image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=1000&auto=format&fit=crop", 
        rating: 4.2, time: "35-45 min", fee: "₹25 Delivery", tags: ["Asian", "Noodles"], isOpen: false 
    },
    { 
        id: 10, name: "The Cocoa Bean", description: "Artisanal chocolates, waffles, and thick shakes.", address: "Alkapuri, Vadodara", 
        image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1000&auto=format&fit=crop", 
        rating: 4.9, time: "15-25 min", fee: "Free Delivery", tags: ["Desserts", "Cafe"], isOpen: true 
    },
    { 
        id: 11, name: "FitBites", description: "Keto-friendly meals and grilled chicken wraps.", address: "Vadsar, Vadodara", 
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000&auto=format&fit=crop", 
        rating: 4.6, time: "30-40 min", fee: "₹15 Delivery", tags: ["Healthy", "Wraps"], isOpen: true 
    },
    { 
        id: 12, name: "Tokyo Drift", description: "Premium sashimi platters and sushi boats.", address: "Fatehgunj, Vadodara", 
        image: "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1000&auto=format&fit=crop", 
        rating: 4.7, time: "40-50 min", fee: "₹60 Delivery", tags: ["Sushi", "Japanese"], isOpen: true 
    },
    { 
        id: 13, name: "Crust & Co.", description: "Gourmet deep-dish pizzas with exotic toppings.", address: "Akota, Vadodara", 
        image: "https://images.unsplash.com/photo-1604381536136-22462f0074df?q=80&w=1000&auto=format&fit=crop", 
        rating: 4.5, time: "35-45 min", fee: "Free Delivery", tags: ["Pizza", "Italian"], isOpen: true 
    },
    { 
        id: 14, name: "Smokey's BBQ", description: "Slow-cooked brisket and pulled pork sandwiches.", address: "Gotri, Vadodara", 
        image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?q=80&w=1000&auto=format&fit=crop", 
        rating: 4.8, time: "45-60 min", fee: "₹50 Delivery", tags: ["American", "Meat"], isOpen: false 
    },
    { 
        id: 15, name: "Midnight Munchies", description: "Late-night sliders, fries, and greasy comfort food.", address: "Karelibaug, Vadodara", 
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1000&auto=format&fit=crop", 
        rating: 4.1, time: "20-30 min", fee: "₹30 Delivery", tags: ["Burgers", "Fast Food"], isOpen: true 
    }
];

export const mockMenus = {
    1: [
        { id: 101, name: "Classic Cheeseburger", description: "Premium beef patty, aged cheddar, secret sauce.", price: 199, imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500&auto=format&fit=crop", isAvailable: true, stockQuantity: null, category: "Burgers" },
        { id: 103, name: "Truffle Burger", description: "Mushroom duxelles, truffle mayo, swiss cheese.", price: 249, imageUrl: "https://images.unsplash.com/photo-1594212202875-86ac1c618b14?q=80&w=500&auto=format&fit=crop", isAvailable: false, stockQuantity: 0, category: "Burgers" },
        { id: 105, name: "Classic Cheeseburger", description: "Premium beef patty, aged cheddar, secret sauce.", price: 199, imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500&auto=format&fit=crop", isAvailable: true, stockQuantity: null, category: "Burgers" },
        { id: 102, name: "Large Fries", description: "Golden crinkle-cut fries with sea salt.", price: 99, imageUrl: "https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=500&auto=format&fit=crop", isAvailable: true, stockQuantity: 5, category: "Sides" },
        { id: 104, name: "Oreo Shake", description: "Thick hand-spun milkshake.", price: 149, imageUrl: null, isAvailable: true, stockQuantity: null, category: "Beverages" }
    ],
    2: [
        { id: 201, name: "Spicy Tuna Roll", description: "Fresh tuna, spicy mayo, cucumber.", price: 349, imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=500&auto=format&fit=crop", isAvailable: true, stockQuantity: null, category: "Sushi" }
    ]
};