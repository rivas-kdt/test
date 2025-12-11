"use client";

import ResetPasswordDesktop from "@/features/forget-password/components/reset-password/components/resetDesktop";
import ResetPasswordMobile from "@/features/forget-password/components/reset-password/components/resetMobile";
import { useIsMobile } from "@/hooks/useMobile";

export default function Home() {
  const isMobile = useIsMobile();

  return <>{isMobile ? <ResetPasswordMobile /> : <ResetPasswordDesktop />}</>;
}
