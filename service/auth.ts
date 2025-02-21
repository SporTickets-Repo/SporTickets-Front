import axios from "axios";

import {
  ForgotPasswordResponse,
  LoginResponse,
  RegisterResponse,
  ResetPasswordResponse,
} from "@/interface/auth";

const API_URL = "http://localhost:4000/auth";

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await axios.post<LoginResponse>(`${API_URL}/login`, {
        identifier: email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  register: async (userData: any): Promise<RegisterResponse> => {
    try {
      const response = await axios.post<RegisterResponse>(
        `${API_URL}/register`,
        userData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  forgotPassword: async (
    email: string,
    token: string
  ): Promise<ForgotPasswordResponse> => {
    try {
      const response = await axios.post<ForgotPasswordResponse>(
        `${API_URL}/forgot-password`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (
    token: string,
    newPassword: string,
    authToken: string
  ): Promise<ResetPasswordResponse> => {
    try {
      const response = await axios.post<ResetPasswordResponse>(
        `${API_URL}/reset-password`,
        { token, newPassword },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
