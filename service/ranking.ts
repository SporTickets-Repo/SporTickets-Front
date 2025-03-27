import { Ranking } from "@/interface/ranking";
import { api } from "./api";

export const rankingService = {
  updateRankingList: async (eventId: string, rankings: Ranking[]) => {
    try {
      const response = await api.put(`/rankings/list/${eventId}`, {
        rankings,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
