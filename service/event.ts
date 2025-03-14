import { Event } from "@/interface/event";
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
};
