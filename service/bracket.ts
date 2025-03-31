import { BracketUpdate } from "@/interface/bracket";
import { api } from "./api";

export const bracketService = {
  updateBracketList: async (eventId: string, brackets: BracketUpdate[]) => {
    console.log("Updating brackets for event ID:", eventId);
    console.log("Brackets data:", brackets);
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
