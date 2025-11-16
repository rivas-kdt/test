"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Lock, User } from "lucide-react";
import { useState } from "react";
import LocaleSwitcher from "@/components/localeSwitcher";
import { useTranslations } from "next-intl";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

const LoginMobile = () => {
  const { login, error, loading } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const t = useTranslations("LoginPage");

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-primary/10 to-background">
      {/* Top-right controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-4">
        <LocaleSwitcher />
        <ThemeToggle />
      </div>

      {/* Logo */}
      <div className="mt-14 mb-8 text-center relative z-10">
        <div className="relative inline-block">
          <div className="text-7xl font-bold tracking-tighter text-primary">
            <span>X</span>
            <span>{t("mon")}</span>
          </div>
          <div className="absolute -top-2 -right-2 bg-primary text-background text-xs px-2 py-1 rounded-full font-bold">
            KDT
          </div>
        </div>
        <p className="mt-2 text-muted-foreground">{t("p1")}</p>
      </div>

      {/* Login Card */}
      <Card className="relative z-10 w-full max-w-sm border-0 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {t("welcome")}
          </CardTitle>
          <CardDescription className="text-center">{t("desc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await login({ username, password });
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="username">{t("username")}</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}
            <Button
              type="submit"
              className="w-full bg-primary text-white"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("loggingIn")}
                </>
              ) : (
                t("title")
              )}
            </Button>
          </form>
        </CardContent>
        <div className="mb-2 -mt-2 text-[12px] flex justify-center items-center">
          {t("forgotPassword")}
          <a
            href="#"
            className="ml-1 text-blue-400"
            onClick={(e) => {
              e.preventDefault();
              router.push("/confirm-email");
            }}
          >
            {t("clickHere")}
          </a>
        </div>
        <p className="text-xs text-center text-muted-foreground mt-2 mb-auto">
          {t("terms")}
        </p>
        <CardFooter className="flex flex-col"></CardFooter>
      </Card>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/60 -z-10" />
      <div className="absolute top-56 -right-10 w-24 h-24 bg-primary/30 -z-10" />
      <div className="absolute top-70 -right-10 w-64 h-64 bg-primary/60 -z-10" />
      <div className="absolute top-115 -left-5 w-30 h-30 bg-primary/70 -z-10" />
      <div className="absolute bottom-0 right-0 w-84 h-64 bg-primary/80 -z-10" />
    </div>
  );
};

export default LoginMobile;
