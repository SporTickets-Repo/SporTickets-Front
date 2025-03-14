import { Event } from "@/interface/event";
import axios from "axios";

const USER_API_URL = "http://localhost:4000/events/";

export const userService = {
  getMe: async (authToken: string): Promise<Event> => {
    try {
      const response = await axios.get<Event>(`${USER_API_URL}/slug`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
