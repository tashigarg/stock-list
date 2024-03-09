import {StockType} from "../StockTypes";
import axios from "axios";
import {ALL_KEY} from "../views/StockConstants";

const BASE_URL = 'http://localhost:3000/stocks';

export const StockAPI = {
    fetchStocks: async function (tag?: string): Promise<{ data: StockType[], tags: string[] }> {
        let tagURL = '';
        if (tag && tag !== ALL_KEY) {
            tagURL = `?tag=${tag}`;
        }
        return axios.get(`${BASE_URL}${tagURL}`).then(response => {
            const tagSet = new Set<string>();
            const data = response.data as StockType[];
            data.forEach(stock => tagSet.add(stock.tag))
            return {
                data,
                tags: [...tagSet]
            }
        }).catch(e => {
            return {
                data: [],
                tags: []
            }
        });
    },

    async deleteStock(stockId: string): Promise<boolean> {
        return axios.delete(`${BASE_URL}/${stockId}`).then(() => {
            return true;
        }).catch(e => {
            return false;
        });
    },

    async fetchStockInfo(stockId: string): Promise<StockType | null> {
        return axios.get(`${BASE_URL}/${stockId}`).then(response => {
            const data = response.data as StockType;
            return data;
        }).catch(e => {
            console.error(`Error in getting the stock information`)
            return null;
        });

    }
}
