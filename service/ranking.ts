import { RankingUpdate } from "@/interface/ranking";
import { api } from "./api";

export const rankingService = {
  updateRankingList: async (eventId: string, rankings: RankingUpdate[]) => {
    try {
      const response = await api.put(`/rankings/list/${eventId}`, {
        rankings,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getRankingsById: async (id: string) => {
    try {
      const response = await api.get(`/rankings/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
