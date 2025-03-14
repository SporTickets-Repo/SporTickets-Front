import { UserProfile } from "@/interface/user";
import { api } from "@/service/api";

export const userService = {
  getMe: async (): Promise<UserProfile> => {
    try {
      const response = await api.get<UserProfile>("/user/me");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
