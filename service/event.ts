import { Event, EventSummary, EventType } from "@/interface/event";
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

  getFilteredEvents: async (
    name?: string,
    startDate?: string,
    minPrice?: number,
    maxPrice?: number,
    type?: string
  ): Promise<EventSummary[]> => {
    try {
      const params: Record<string, string | number> = {};

      if (name) params.name = name;
      if (startDate) params.startDate = startDate;
      if (minPrice !== undefined && minPrice > 0) params.minPrice = minPrice;
      if (maxPrice !== undefined && maxPrice > 0) params.maxPrice = maxPrice;
      if (type && type !== "all") params.type = type;

      const response = await api.get<EventSummary[]>(`/events/filter`, {
        params,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getEventTypes: async (): Promise<EventType[]> => {
    try {
      const response = await api.get<EventType[]>(`/events/types`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
