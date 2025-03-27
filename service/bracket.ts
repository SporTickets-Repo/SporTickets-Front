import { Bracket } from "@/interface/bracket";
import { api } from "./api";

export const bracketService = {
  updateBracketList: async (eventId: string, brackets: Bracket[]) => {
    try {
      const response = await api.put(`/brackets/list/${eventId}`, {
        brackets,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
