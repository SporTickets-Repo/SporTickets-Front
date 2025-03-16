import { Event, EventSummary } from "@/interface/event";
import axios from "axios";

const EVENT_API_URL = "http://localhost:4000/events";

export const eventService = {
  getEventBySlug: async (slug: string): Promise<Event> => {
    try {
      const response = await axios.get<Event>(`${EVENT_API_URL}/slug/${slug}`);
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
      const response = await axios.get<EventSummary[]>(`${EVENT_API_URL}/all`, {
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
