"use client";

import ConfirmEmailDesktop from "@/features/forget-password/components/confirm-email/components/confirmDesktop";
import ConfirmEmailMobile from "@/features/forget-password/components/confirm-email/components/confirmMobile";
import { useIsMobile } from "@/hooks/useMobile";

export default function Home() {
  const isMobile = useIsMobile();

  return <>{isMobile ? <ConfirmEmailMobile /> : <ConfirmEmailDesktop />}</>;
}
