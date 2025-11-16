"use client";
import React, { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/useMobile";
import LoginMobile from "./components/loginMobile";
import LoginDesktop from "./components/loginDesktop";

export default function LoginPage() {
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile !== undefined) {
      setLoading(false);
    }
  }, [isMobile]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }
  return <>{isMobile ? <LoginMobile /> : <LoginDesktop />}</>;
};
