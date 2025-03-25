import { Player } from "@/interface/tickets";
import { registerWithoutPassword, UserProfile } from "@/interface/user";
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

  getUserByEmail: async (email: string): Promise<Player> => {
    try {
      const response = await api.get<Player>(`/user/by-email/${email}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  registerWithoutPassword: async (
    user: registerWithoutPassword
  ): Promise<Player> => {
    try {
      const response = await api.post<Player>("/user/register", user);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
