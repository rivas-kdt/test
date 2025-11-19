"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "../hooks/sessionProvider";
import { useTheme } from "next-themes";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();

  const isAuthPage = pathname === "/login";

  useEffect(() => {
    if (!loading && !user && !isAuthPage) {
      router.push("/login");
    }
  }, [user, loading, router, isAuthPage]);

  if (loading && !isAuthPage) {
    return (
      <div
        className={`flex items-center justify-center w-full h-screen transition-colors duration-300 ${
          theme === "dark" ? "bg-[#0f1729]" : "bg-[#f8fafc]"
        }`}
      >
        <div className="loader">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`box box${i}`}>
              <div></div>
            </div>
          ))}
          <div className="ground">
            <div></div>
          </div>
        </div>
      </div>
    );
  }

  // Don't block rendering for /login
  if (!user && !isAuthPage) return null;

  return children;
}
