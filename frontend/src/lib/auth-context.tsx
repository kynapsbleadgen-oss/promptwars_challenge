import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { api, setToken, getToken } from "./api";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  bio: string;
  active: boolean;
  createdAt: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      // Try to refresh token from httpOnly cookie on mount.
      const refreshRes = await fetch("http://localhost:5000/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        setToken(data.accessToken);

        // Now fetch the user profile.
        const meRes = await api<{ user: User }>("/auth/me");
        setUser(meRes.user);
      } else {
        setToken(null);
        setUser(null);
      }
    } catch {
      setToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    // Only attempt session restore on the client.
    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }
    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const data = await api<{ user: User; accessToken: string }>("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    setToken(data.accessToken);
    setUser(data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await api<{ user: User; accessToken: string }>("/auth/register", {
      method: "POST",
      body: { name, email, password },
    });
    setToken(data.accessToken);
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await api("/auth/logout", { method: "POST" });
    } catch {
      // Ignore — we clear client state regardless.
    }
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
