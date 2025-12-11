"use client";

import { useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LocaleSwitcher from "@/components/localeSwitcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function ResetPasswordDesktop() {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const t = useTranslations("reset-password");

  const handleResetDesktop = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-5xl flex flex-col md:flex-row overflow-hidden rounded-2xl shadow-2xl">
        {/* Left side - Brand/Logo */}
        <div className="w-full md:w-1/2 bg-primary dark:text-background p-12 flex flex-col items-center justify-center">
          <div className="mb-8 text-center">
            <div className="relative">
              <div className="text-8xl font-bold tracking-tighter">
                <span>X</span>
                <span>{t("mon")}</span>
              </div>
              <div className="absolute -top-3 -right-3 bg-foreground dark:bg-primary-foreground text-primary text-xs px-2 py-1 rounded-full font-bold">
                KDT
              </div>
            </div>
            <p className="mt-4 dark:text-secondary text-foreground text-lg">
              {t("p1")}
            </p>
          </div>
        </div>
        <Card className="w-full md:w-1/2 border-0 rounded-none shadow-none">
          <CardHeader className="space-y-1 pt-12 relative">
            <div className="absolute top-4 right-4 flex gap-2">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
            <CardTitle className="text-3xl font-bold">
              {t("resetPass")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetDesktop} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password">{t("newPass")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-secondary-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder={t("enterPass")}
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t("newPass")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-secondary-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder={t("confirmPass")}
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

              <Button type="submit" className="w-full" disabled={loading}>
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
    </div>
  );
}
