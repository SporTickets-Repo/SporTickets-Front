import { api } from "@/service/api";

import {
  ForgotPasswordResponse,
  LoginResponse,
  RegisterBody,
  RegisterResponse,
  ResetPasswordResponse,
} from "@/interface/auth";

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>("/auth/login", {
        identifier: email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  register: async (userData: RegisterBody): Promise<RegisterResponse> => {
    try {
      const response = await api.post<RegisterResponse>(
        "/auth/register",
        userData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  forgotPassword: async (email: string): Promise<ForgotPasswordResponse> => {
    try {
      const response = await api.post<ForgotPasswordResponse>(
        "/auth/forgot-password",
        { email }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (
    token: string,
    newPassword: string
  ): Promise<ResetPasswordResponse> => {
    try {
      const response = await api.post<ResetPasswordResponse>(
        "/auth/reset-password",
        { token, newPassword }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  checkEmail: async (email: string): Promise<boolean> => {
    try {
      const response = await api.get<boolean>(`/auth/check-email/${email}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
