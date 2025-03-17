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

  updateUser: async (payload: FormData): Promise<UserProfile> => {
    try {
      const response = await api.patch<UserProfile>("/user/update", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
