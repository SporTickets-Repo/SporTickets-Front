import { UserProfile } from "@/interface/user";
import axios from "axios";

const USER_API_URL = "http://localhost:4000/user";

export const userService = {
  getMe: async (authToken: string): Promise<UserProfile> => {
    try {
      const response = await axios.get<UserProfile>(`${USER_API_URL}/me`, {
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
