import { Event, EventSummary } from "@/interface/event";
import { api } from "@/service/api";

export const eventService = {
  getEventBySlug: async (slug: string): Promise<Event> => {
    try {
      const response = await api.get<Event>(`/events/slug/${slug}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllEvents: async (
    page: number,
    limit: number,
    sort: string
  ): Promise<EventSummary[]> => {
    try {
      const response = await api.get<EventSummary[]>(`/events/all`, {
        params: {
          page,
          limit,
          sort,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
