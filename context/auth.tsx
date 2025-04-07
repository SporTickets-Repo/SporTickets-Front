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
  useCallback,
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

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);

      Cookies.set("token", response.access_token, {
        expires: cookiesExpirationDays,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      });

      setToken(response.access_token);

      await fetchUser();

      await new Promise((resolve) => setTimeout(resolve, 50));

      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect");
      const safeRedirect = redirect?.startsWith("/") ? redirect : "/";

      console.log("Redirecionando para:", redirect);

      window.location.href = safeRedirect;
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

  const logout = useCallback(
    (returnHome: boolean = true) => {
      Cookies.remove("token");
      Cookies.remove("user");

      setToken(null);
      setUser(null);

      if (returnHome) {
        router.push("/");
      }
    },
    [router]
  );

  const fetchUser = useCallback(async () => {
    const storedToken = Cookies.get("token");
    if (!storedToken) return;

    try {
      const response = await userService.getMe();

      Cookies.set("user", encodeURIComponent(JSON.stringify(response)), {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        expires: cookiesExpirationDays,
      });

      setUser(response);
    } catch (error) {
      logout(false);
      throw error;
    }
  }, [logout]);

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [fetchUser, token]);

  useEffect(() => {
    const storedToken = Cookies.get("token");
    const storedUser = Cookies.get("user");

    if (storedToken) {
      setToken(storedToken);
    }

    if (storedUser) {
      try {
        const decoded = decodeURIComponent(storedUser);
        setUser(JSON.parse(decoded));
      } catch (err) {
        console.error("Erro ao ler cookie 'user':", err);
        Cookies.remove("user");
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, registration, fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuth };
