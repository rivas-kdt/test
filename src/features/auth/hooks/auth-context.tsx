/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { login } from "../services/login";
import { decrypt } from "@/lib/jwt";
import { useRouter } from "next/navigation";
import { create, deleteSession, get } from "@/lib/cookieHandler";

export interface User {
  userId: string;
  email: string;
  role: string;
  warehouse: { id: string; name: string; location: string };
  username: string;
}

export interface Session {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType {
  session: Session;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loginError: string | null;
  loginLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getClientCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null;
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [session, setSession] = useState<Session>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = getClientCookie("jwt");
        if (!token) {
          setSession({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          });
          return;
        }

        const decoded = await decrypt(token);
        if (!decoded || !decoded.user) {
          setSession({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          });
          return;
        }

        setSession({
          user: decoded.user,
          isLoading: false,
          isAuthenticated: true,
        });
      } catch {
        setSession({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await get("jwt");
        if (!token) {
          setSession({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          });
          return;
        }

        const decoded = await decrypt(token);
        if (!decoded || !decoded.user) {
          setSession({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          });
          return;
        }

        setSession({
          user: decoded.user,
          isLoading: false,
          isAuthenticated: true,
        });
      } catch {
        setSession({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    getToken();
  }, []);

  const handleLogin = useCallback(
    async (username: string, password: string) => {
      setLoginError(null);
      setLoginLoading(true);

      try {
        console.log(username, password);
        const result = await login(username, password);
        if (!result || !result.token) {
          throw new Error("Login failed, no token received");
        }
        await create(result.token);

        setSession({
          user: result.user,
          isLoading: false,
          isAuthenticated: true,
        });

        router.push("/");
      } catch (err: any) {
        setLoginError(err?.message || "Login failed");
      } finally {
        setLoginLoading(false);
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    await deleteSession();
    setSession({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        session,
        login: handleLogin,
        logout,
        loginError,
        loginLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
