/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { RegisterBody } from "@/interface/auth";
import { UserProfile } from "@/interface/user";
import { authService } from "@/service/auth";
import { userService } from "@/service/user";
import { useRouter } from "next/navigation";
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
  registration: (userData: RegisterBody) => Promise<void>;
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  token: null,
  login: async () => {},
  logout: () => {},
  registration: async () => {},
  fetchUser: async () => {},
});

const useAuth = () => useContext(AuthContext);

const AuthProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);
    }
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);
    }
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);
    }
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      setToken(response.access_token);
      localStorage.setItem("token", response.access_token);
      localStorage.setItem("token", response.access_token);
      await fetchUser();
      router.push("/");
    } catch (error) {
      throw error;
    }
  };

  const registration = async (userData: RegisterBody) => {
    try {
      const response = await authService.register(userData);
      setUser(response);
      localStorage.setItem("user", JSON.stringify(response));
    } catch (error: any) {
      throw error;
    }
  };

  const fetchUser = async () => {
    if (!token) return;
    try {
      const response = await userService.getMe();
      setUser(response);
      localStorage.setItem("user", JSON.stringify(response));
      localStorage.setItem("user", JSON.stringify(response));
    } catch (error) {
      logout();
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, registration, fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuth };
