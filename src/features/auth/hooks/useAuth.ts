import { decrypt } from "@/lib/jwt";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { login } from "../services/login";
import { create, deleteSession, get } from "@/lib/cookieHandler";
import toast from "react-hot-toast"

interface User {
  userId: string;
  username: string;
  role: string;
  email: string;
}

export function useAuth(requireAuth: boolean = true) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getToken = async () => {
      try {
        const res = await get("jwt");
        if (!res) {
          console.log("No JWT token found");
          if (requireAuth) router.push("/login");
          return;
        }
        const sesh = await decrypt(res);
        if (!sesh) {
          console.log("Failed to decrypt session");
          if (requireAuth) router.push("/login");
        } else {
          setUser(sesh.user as User);
        }
      } catch (error) {
        console.error("Error getting or decrypting token:", error);
        if (requireAuth) router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    getToken();
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
      if (!response || !response.token) {
        throw new Error("Login failed, no token received");
      }
      await create(response.token);
      console.log("Login successful, token:", response.token);
      router.push("/");
      toast.success('Log in successful!')
    } catch (error: any) {
      setError(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await deleteSession();
    } catch (error) {
      console.error("Error deleting session:", error);
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  return { loading, user, login: handleLogin, logout, error };
}
