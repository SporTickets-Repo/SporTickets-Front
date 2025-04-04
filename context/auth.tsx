/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { RegisterBody } from "@/interface/auth";
import { UserProfile } from "@/interface/user";
import { authService } from "@/service/auth";
import { userService } from "@/service/user";
import Cookies from "js-cookie";
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
  login: (
    email: string,
    password: string,
    redirect: string | null | undefined
  ) => Promise<void>;
  logout: () => void;
  registration: (userData: RegisterBody) => Promise<void>;
  fetchUser: () => Promise<void>;
}

const cookiesExpirationDays = 1;

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
    const storedToken = Cookies.get("token");
    const storedUser = Cookies.get("user");

    if (storedToken) {
      setToken(storedToken);
    }
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (
    email: string,
    password: string,
    redirect?: string | null | undefined
  ) => {
    try {
      const response = await authService.login(email, password);

      Cookies.set("token", response.access_token, {
        expires: cookiesExpirationDays,
        secure: true,
      });
      setToken(response.access_token);

      await fetchUser();

      router.push(redirect || "/");
    } catch (error) {
      throw error;
    }
  };

  const registration = async (userData: RegisterBody) => {
    try {
      await authService.register(userData);
    } catch (error: any) {
      throw error;
    }
  };

  const fetchUser = async () => {
    const storedToken = Cookies.get("token");
    if (!storedToken) return;

    try {
      const response = await userService.getMe();

      Cookies.set("user", JSON.stringify(response), {
        expires: cookiesExpirationDays,
        secure: true,
      });
      setUser(response);
    } catch (error) {
      logout(false);
      throw error;
    }
  };

  const logout = (returnHome: boolean = true) => {
    Cookies.remove("token");
    Cookies.remove("user");

    setToken(null);
    setUser(null);

    if (returnHome) {
      router.push("/");
    }
  };

  useEffect(() => {
    if (token) {
      fetchUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, registration, fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuth };
