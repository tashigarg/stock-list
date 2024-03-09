import axios from 'axios';
import { StockType } from '../StockTypes';
import { ALL_KEY } from '../views/StockConstants';

/** API Base URL **/
const BASE_URL = 'http://localhost:3000/stocks';

export const StockAPI = {
    /**
     * Fetch the list of stocks. Additionally filter can be added on the stock list
     * @param tag Tag to filter the list
     */
    fetchStocks: async function (tag?: string): Promise<StockType[]> {
        let tagURL = '';
        if (tag && tag !== ALL_KEY) {
            tagURL = `?tag=${tag}`;
        }
        return axios.get(`${BASE_URL}${tagURL}`).then(response => {
            const data = response?.data as StockType[] || [];
            return data;
        }).catch(_ => {
            return [];
        });
    },

    /**
     * Delete the stock by its id. Returns if deleted or not
     * @param stockId Stock Id to be deleted
     */
    async deleteStock(stockId: string): Promise<boolean> {
        return axios.delete(`${BASE_URL}/${stockId}`).then(() => {
            return true;
        }).catch(_ => {
            return false;
        });
    },

    /**
     * Fetch stock information by getting the stock details by its id
     * @param stockId Stock ID 
     */
    async fetchStockInfo(stockId: string): Promise<StockType | null> {
        return axios.get(`${BASE_URL}/${stockId}`).then(response => {
            const data = response.data as StockType;
            return data;
        }).catch(_ => {
            console.error(`Error in getting the stock information`);
            return null;
        });

    }
}
