import { Transaction } from "@/interface/transaction";
import { api } from "./api";

export const transactionService = {
  getTransactionById: async (transactionId: string): Promise<Transaction> => {
    try {
      const response = await api.get(`/transactions/${transactionId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getTransactionsByEventId: async (): Promise<Transaction[]> => {
    try {
      const response = await api.get(`/transactions/event/list`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
