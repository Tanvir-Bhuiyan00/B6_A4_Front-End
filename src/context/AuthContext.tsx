"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authApi, User } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: "STUDENT" | "TUTOR"
  ) => Promise<void>;
  logout: () => void;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      authApi
        .me()
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("token");
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    localStorage.setItem("token", res.token);
    setToken(res.token);
    setUser(res.data);
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: "STUDENT" | "TUTOR"
  ) => {
    const res = await authApi.register({ name, email, password, role });
    localStorage.setItem("token", res.token);
    setToken(res.token);
    setUser(res.data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const refetchUser = async () => {
    try {
      const res = await authApi.me();
      setUser(res.data);
    } catch {
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, refetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
