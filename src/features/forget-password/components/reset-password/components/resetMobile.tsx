"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Lock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import LocaleSwitcher from "@/components/localeSwitcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTranslations } from "next-intl";

export default function ResetPasswordMobile() {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  const t = useTranslations("reset-password");

  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const exp = searchParams.get("exp");

  const isExpired = exp ? new Date(exp) < new Date() : true;

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setError(t("fillFields"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("matchFields"));
      return;
    }

    if (!email || !token) {
      setError(t("invalid"));
      return;
    }

    setLoading(true);

    // try {
    //   const res = await fetch("/api/reset-password", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       email,
    //       token,
    //       password,
    //     }),
    //   });

    //   const result = await res.json();

    //   if (!res.ok) {
    //     setError(result.error || "Reset failed.");
    //     return;
    //   }

    //   alert("Password reset successfully!");
    //   router.push("/login");
    // } catch (err: any) {
    //   console.error("Reset error:", err);
    //   setError("An error occurred. Please try again.");
    // } finally {
    //   setLoading(false);
    // }
  };

  if (isExpired) {
    return (
      <div className="p-6 text-center text-destructive font-bold">
        {t("resetExpire")}
      </div>
    );
  }

  return (
    <ScrollArea>
      <div className="flex flex-col w-screen p-4 pt-20 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="absolute top-4 right-4 z-10 flex gap-4">
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
        <div className="mt-14 mb-8 text-center">
          <div className="relative inline-block">
            <div className="text-7xl font-bold tracking-tighter text-primary">
              <span>X</span>
              <span className="opacity-80">{t("mon")}</span>
            </div>
            <div className="absolute -top-2 -right-2 bg-primary text-background text-xs px-2 py-1 rounded-full font-bold">
              KDT
            </div>
          </div>
          <p className="mt-2 text-muted-foreground">{t("p1")}</p>
        </div>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {t("resetPass")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">{t("newPass")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder={t("confirmPass")}
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("confirmPass")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder={t("confirmNew")}
                    className="pl-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm font-medium text-destructive">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full bg-primary"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("reset")}
                  </>
                ) : (
                  t("confirm")
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
