import { api } from "./api";

export const dashboardService = {
  assignList: async (data: {
    userIds: string[];
    eventId: string;
  }): Promise<any> => {
    try {
      const response = await api.put(`/dashboard/event/list/assign`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUsersWithAccess: async (eventId: string): Promise<any> => {
    try {
      const response = await api.get(`/dashboard/event/${eventId}/users`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
