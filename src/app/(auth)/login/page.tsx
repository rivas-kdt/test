"use client";
import React, { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/useMobile";
import LoginMobile from "../../../features/auth/components/loginMobile";
import LoginDesktop from "../../../features/auth/components/loginDesktop";
import { useAuth } from "@/features/auth/hooks/auth-context";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/loader";

export default function LoginPage() {
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();
  const isMobile = useIsMobile();

  const router = useRouter();

  useEffect(() => {
    if (session.isLoading || isMobile === undefined) return;
    if (session.user) {
      router.push("/");
      return;
    }
    setLoading(false);
  }, [session, isMobile, router]);

  if (loading) {
    return <Loader />;
  }
  return <>{isMobile ? <LoginMobile /> : <LoginDesktop />}</>;
}
