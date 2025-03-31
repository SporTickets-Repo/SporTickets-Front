import { RankingUpdate } from "@/interface/ranking";
import { api } from "./api";

export const rankingService = {
  updateRankingList: async (eventId: string, rankings: RankingUpdate[]) => {
    try {
      console.log("Updating rankings for event ID:", eventId);
      console.log("Rankings data:", rankings);
      const response = await api.put(`/rankings/list/${eventId}`, {
        rankings,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
