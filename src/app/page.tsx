"use client";
import Loader from "@/components/ui/loader";
import { ProtectedRoute } from "@/features/auth/components/protected-route";
import DashboardContent from "@/features/dashboard/components/DashboardContent";
import LandingContent from "@/features/landing/components/LandingContent";
import { useIsMobile } from "@/hooks/useMobile";
import { useEffect, useState } from "react";

export default function Home() {
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isMobile !== undefined) {
      setLoading(false);
    }
  }, [isMobile]);

  if (loading) {
    <Loader />;
  }

  return (
    <ProtectedRoute>
      {isMobile ? <LandingContent /> : <DashboardContent />}
    </ProtectedRoute>
  );
}
