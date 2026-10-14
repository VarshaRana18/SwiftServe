// src/utils/categoryEmojis.js

export const categoryEmojiMap = {
    // Popular & Fast Food
    "burgers": "🍔", "pizza": "🍕", "fast food": "🌭", "wraps": "🌯", 
    "sandwiches": "🥪", "wings": "🍗", "fried chicken": "🍗", "fries": "🍟",
    
    // Indian Cuisines
    "dosa": "🥞", "south indian": "🍛", "north indian": "🍲", "biryani": "🥘", 
    "indian": "🥘", "thali": "🍛", "street food": "🍢", "chaat": "🥔", 
    "mughlai": "🍖", "tandoori": "🍗",
    
    // Asian & Global
    "chinese": "🍜", "sushi": "🍣", "asian": "🍱", "thai": "🍛", 
    "noodles": "🍜", "mexican": "🌮", "italian": "🍝", "pasta": "🍝", 
    "bbq": "🥩", "steak": "🥩", "seafood": "🦐", "middle eastern": "🥙",
    
    // Healthy & Dietary
    "healthy": "🥗", "salads": "🥗", "vegan": "🥬", "vegetarian": "🥦", 
    "soups": "🥣", "keto": "🥑",
    
    // Breakfast, Bakery & Desserts
    "breakfast": "🍳", "waffles": "🧇", "pancakes": "🥞", "bakery": "🥐", 
    "dessert": "🍦", "ice cream": "🍨", "donuts": "🍩", "cakes": "🎂", 
    "pastries": "🧁", "sweets": "🍬", "mithai": "🍡",
    
    // Beverages
    "beverages": "🥤", "cafe": "☕", "coffee": "☕", "tea": "🍵", 
    "juices": "🍹", "smoothies": "🥤", "shakes": "🥛", "boba": "🧋"
};

/**
 * Normalizes the category string and returns the matching emoji.
 * Falls back to the generic plate emoji if no match is found.
 */
export const getCategoryEmoji = (categoryName) => {
    if (!categoryName) return "🍽️";
    
    const normalized = categoryName.toLowerCase().trim();
    
    // Direct match
    if (categoryEmojiMap[normalized]) {
        return categoryEmojiMap[normalized];
    }

    // Partial match (e.g., if category is "Ice Cream & Shakes", it finds "ice cream")
    for (const [key, emoji] of Object.entries(categoryEmojiMap)) {
        if (normalized.includes(key)) {
            return emoji;
        }
    }

    // Ultimate fallback
    return "🍽️"; 
};