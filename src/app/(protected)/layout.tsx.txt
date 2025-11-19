"use client";

import Loader from "@/components/ui/loader";
import { useSession } from "@/features/auth/hooks/sessionProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, sessionLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!sessionLoading && !user) {
      router.push("/login");
    }
  }, [user, sessionLoading, router]);

  if (sessionLoading) return <Loader />;

  if (!user) return null;

  return <>{children}</>;
}
