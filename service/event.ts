import { Event, EventLevel, EventSummary, EventType } from "@/interface/event";
import { api } from "@/service/api";
import { InitResponseDto } from "./dto/init.response.dto";

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

  init: async (): Promise<InitResponseDto> => {
    try {
      const response = await api.post(`/events/init`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getEventById: async (eventId: string): Promise<Event> => {
    try {
      const response = await api.get<Event>(`/events/${eventId}`);
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

  getEventLevels: async (): Promise<EventLevel[]> => {
    try {
      const response = await api.get<EventLevel[]>(`/events/levels`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  putEvent: async (eventId: string, formData: FormData): Promise<Event> => {
    try {
      const response = await api.put<Event>(`/events/${eventId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMyEvents: async (): Promise<Event[]> => {
    try {
      const response = await api.get<Event[]>(`/events/my-events`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getEventsUserMaster: async (userId: string): Promise<Event[]> => {
    try {
      const response = await api.get<Event[]>(`/events/all-master/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  setEventStatus: async (eventId: string, status: string): Promise<Event> => {
    try {
      const response = await api.put<Event>(`/events/${eventId}/set-status`, {
        status,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  eventFee: async (eventId: string, eventFee: number): Promise<Event> => {
    try {
      const response = await api.put<Event>(`/events/${eventId}/event-fee`, {
        eventFee,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateEventTerms: async (
    eventId: string,
    formData: FormData
  ): Promise<void> => {
    try {
      await api.put(`/events/${eventId}/terms`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      throw error;
    }
  },

  async updatePaymentSettings(eventId: string, data: any): Promise<void> {
    try {
      await api.put(`/events/${eventId}/payment-settings`, data);
    } catch (error) {
      throw error;
    }
  },
};
