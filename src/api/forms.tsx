// Utility functions to interact with local storage

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Configurable delay time in milliseconds
const API_DELAY = 1000; // 1 second

/**
 * Save data to local storage
 * @param key - The key under which the data will be stored
 * @param data - The data to be stored
 * @returns A promise that resolves when the data is successfully stored
 */
export const saveToLocalStorage = (key: string, data: any): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        try {
            await delay(API_DELAY);
            localStorage.setItem(key, JSON.stringify(data));
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Get data from local storage
 * @param key - The key under which the data is stored
 * @returns A promise that resolves with the retrieved data
 */
export const getFromLocalStorage = (key: string): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            await delay(API_DELAY);
            const data = localStorage.getItem(key);
            resolve(data ? JSON.parse(data) : null);
        } catch (error) {
            reject(error);
        }
    });
};