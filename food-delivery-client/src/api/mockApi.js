import { restaurants, mockMenus, categories, promotions } from "../data/mockData";

// Simulate a 1.5-second network delay
const NETWORK_DELAY = 1500; 

export const fetchHomeData = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ restaurants, categories, promotions, mockMenus });
        }, NETWORK_DELAY);
    });
};

export const fetchRestaurantDetails = (id) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const restaurant = restaurants.find(r => r.id === id);
            const menu = mockMenus[id] || [];
            resolve({ restaurant, menu });
        }, NETWORK_DELAY);
    });
};