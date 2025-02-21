"use client";
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
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      setToken(response.access_token);
      await fetchUser();
      router.push("/");
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: any) => {
    const response = await authService.register(userData);
    setUser(response);
  };

  const fetchUser = async () => {
    if (!token) return;
    try {
      const response = await userService.getMe(token);
      console.log("User fetched:", response);
      setUser(response);
    } catch (error) {
      logout();
      throw error;
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
