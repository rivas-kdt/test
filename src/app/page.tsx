"use client"
import { ProtectedRoute } from "@/features/auth/components/protected-route";
import DashboardContent from "@/features/dashboard/components/DashboardContent";
import LandingContent from "@/features/landing/components/LandingContent";
import { useIsMobile } from "@/hooks/useMobile";

export default function Home() {
  const isMobile = useIsMobile()
  return (
    <ProtectedRoute>{isMobile ? <LandingContent /> : <DashboardContent />}</ProtectedRoute>
  );
}
