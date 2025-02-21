"use client";
import { UserProfile } from "@/interface/user";
import { authService } from "@/service/auth";
import { userService } from "@/service/user";
import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextProps {
  user: UserProfile | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  token: null,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  fetchUser: async () => {},
});

const useAuth = () => useContext(AuthContext);

const AuthProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    setToken(response.access_token);
    await fetchUser();
  };

  const register = async (userData: any) => {
    const response = await authService.register(userData);
    setUser(response);
  };

  const fetchUser = async () => {
    if (!token) return;
    try {
      const response = await userService.getMe(token);
      setUser(response);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      logout();
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, register, fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuth };
