/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import { decrypt } from "@/lib/jwt";
import { login } from "../services/login";

interface SessionContextType {
  user: any;
  loading: boolean;
  sessionLoading: boolean;
  error: string | null;
  login: (args: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

function getClientCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";")[0] || null;
  return null;
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = getClientCookie("jwt");
        if (!token) {
          router.push("/login");
          return;
        }
        const sesh = await decrypt(token);
        if (!sesh) {
          router.push("/login");
          return;
        }
        setUser(sesh.user);
      } catch (err) {
        router.push("/login");
      } finally {
        setSessionLoading(false);
      }
    };
    checkSession();
  }, []);

  const handleLogin = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    setLoading(true);
    setError("");

    try {
      const response = await login(username, password);
      if (!response?.token) throw new Error("Login failed");
      document.cookie = `jwt=${response.token}; path=/; secure`;
      setUser(response.user);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    document.cookie = "jwt=; Max-Age=0; path=/";
    setUser(null);
    router.push("/login");
  };

  return (
    <SessionContext.Provider
      value={{
        user,
        loading,
        sessionLoading,
        error,
        login: handleLogin,
        logout,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within a SessionProvider");
  return ctx;
}
