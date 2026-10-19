// src/utils/categoryEmojis.js

export const categoryEmojiMap = {
    // 🍔 Popular & Fast Food
    "Burgers": "🍔",
    "Pizza": "🍕",
    "Fast Food": "🌭",
    "Sandwiches": "🥪",
    "Wraps & Rolls": "🌯",
    "Fried Chicken": "🍗",
    "Wings": "🍗",
    "Fries & Sides": "🍟",
    "Hot Dogs": "🌭",
    "Sliders": "🍔",

    // 🥘 Indian Regional & Specialties
    "North Indian": "🍲",
    "South Indian": "🍛",
    "Biryani": "🥘",
    "Dosa & Idli": "🥞",
    "Thali": "🍛",
    "Chaat & Street Food": "🥔",
    "Mughlai": "🍖",
    "Tandoori & Kebabs": "🍢",
    "Pav Bhaji": "🍞",
    "Chole Bhature": "🍲",
    "Momos & Dumplings": "🥟",
    "Gujarati": "🍛",
    "Rajasthani": "🥘",
    "Bengali": "🐟",
    "Maharashtrian": "🍛",
    "Indo-Chinese": "🍜",

    // 🍚 Indian Breads & Staples
    "Roti & Naan": "🫓",
    "Parathas": "🫓",
    "Rice & Pulao": "🍚",
    "Khichdi": "🍛",
    "Dal & Curry": "🍲",

    // 🍱 Asian & Global Cuisines
    "Chinese": "🥡",
    "Sushi & Japanese": "🍣",
    "Thai": "🍲",
    "Korean": "🍜",
    "Asian": "🍱",
    "Italian": "🍝",
    "Pasta": "🍝",
    "Mexican": "🌮",
    "Tacos & Burritos": "🌮",
    "Middle Eastern": "🥙",
    "Lebanese": "🥙",
    "Mediterranean": "🥙",
    "Continental": "🥩",
    "American": "🍔",

    // 🥗 Diet & Lifestyle
    "Healthy": "🥗",
    "Salads": "🥗",
    "Vegan": "🥬",
    "Vegetarian": "🥦",
    "Keto": "🥑",
    "Gluten-Free": "🌾",
    "Organic": "🌱",
    "Soups": "🥣",

    // 🥩 Meat & Seafood
    "Chicken": "🍗",
    "Mutton": "🍖",
    "Seafood": "🦐",
    "Steak & BBQ": "🥩",
    "Eggs": "🍳",

    // 🥞 Breakfast & Bakery
    "Breakfast": "🍳",
    "Bakery": "🥐",
    "Cakes & Pastries": "🎂",
    "Pancakes & Crepes": "🥞",
    "Waffles": "🧇",
    "Donuts": "🍩",
    "Cookies & Brownies": "🍪",
    "Breads": "🥖",

    // 🍦 Desserts & Sweets
    "Desserts": "🍨",
    "Ice Cream": "🍦",
    "Gelato": "🍨",
    "Indian Sweets": "🍬",
    "Mithai": "🍡",
    "Jalebi & Churros": "🥨",
    "Chocolates": "🍫",

    // 🥤 Beverages & Cafe
    "Beverages": "🥤",
    "Coffee & Espresso": "☕",
    "Tea & Chai": "🍵",
    "Boba & Bubble Tea": "🧋",
    "Smoothies": "🥤",
    "Shakes": "🥛",
    "Fresh Juices": "🧃",
    "Mocktails": "🍹",
    "Sodas": "🥤",

    // 📦 Menu Sections
    "Starters": "🥟",
    "Appetizers": "🥟",
    "Main Course": "🍛",
    "Snacks": "🍟",
    "Combos": "🍱",
    "Platters": "🍱",
    "Kids Menu": "🧸",
    "Dips & Sauces": "🥣"
};

/**
 * Normalizes the category string and returns the matching emoji.
 * Falls back to the generic plate emoji if no match is found.
 */
export const getCategoryEmoji = (categoryName) => {
    if (!categoryName) return "🍽️";
    
    const normalized = categoryName.toLowerCase().trim();
    
    // Direct match (case insensitive)
    const exactMatchKey = Object.keys(categoryEmojiMap).find(
        key => key.toLowerCase() === normalized
    );
    if (exactMatchKey) {
        return categoryEmojiMap[exactMatchKey];
    }

    // Partial match (e.g., if backend sends "Ice Cream & Shakes", it finds "ice cream")
    for (const [key, emoji] of Object.entries(categoryEmojiMap)) {
        if (normalized.includes(key.toLowerCase()) || key.toLowerCase().includes(normalized)) {
            return emoji;
        }
    }

    // Ultimate fallback
    return "🍽️"; 
};

/**
 * Helper to get just the list of category names for dropdowns
 */
export const getCategoryNames = () => {
    return Object.keys(categoryEmojiMap).sort();
};