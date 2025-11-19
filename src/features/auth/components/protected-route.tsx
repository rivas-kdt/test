"use client";

import Loader from "@/components/ui/loader";
import { useAuth } from "../hooks/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!session.isLoading && !session.isAuthenticated) {
      router.push(redirectTo);
    }
  }, [session.isAuthenticated, session.isLoading, redirectTo, router]);

  if (session.isLoading) {
    return <Loader />;
  }

  if (!session.isAuthenticated) {
    return null;
  }

  return children;
}
