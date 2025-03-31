import { BracketUpdate } from "@/interface/bracket";
import { api } from "./api";

export const bracketService = {
  updateBracketList: async (eventId: string, brackets: BracketUpdate[]) => {
    try {
      const response = await api.put(`/brackets/list/${eventId}`, {
        brackets,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getBracketsById: async (id: string) => {
    try {
      const response = await api.get(`/brackets/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
