"use client";
import LocaleSwitcher from "@/components/localeSwitcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Lock, Loader2, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const LoginDesktop = () => {
  const { login, error, loading } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const t = useTranslations("LoginPage");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-primary/10 to-background">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-150 h-150 bg-primary/60 -z-10" />
      {/* <div className="absolute top-0 left-0 w-42 h-42 bg-primary/10 -z-10 rounded-br-[100%]" /> */}
      <div className="absolute top-15 left-100 w-20 h-20 bg-primary/50" />
      <div className="absolute top-30 left-40 w-76 h-76 bg-primary/40" />
      <div className="absolute bottom-0 right-60 w-100 h-82 bg-primary/20" />
      <div className="absolute bottom-0 left-0 w-150 h-150 bg-primary/10" />

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
            <p className="mt-4 dark:text-secondary text-foregound text-lg">
              {t("p1")}
            </p>
          </div>
        </div>

        {/* Right side - Login Form */}
        <Card className="w-full md:w-1/2 border-0 rounded-none shadow-none">
          <CardHeader className="space-y-1 pt-12 relative">
            <div className="absolute top-4 right-4 flex gap-2">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
            <CardTitle className="text-3xl font-bold">{t("welcome")}</CardTitle>
            <CardDescription>{t("desc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await login({ username, password });
              }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="username">{t("username")}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4  text-secondary-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t("password")}</Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4  text-secondary-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
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
                className="w-full curosr-pointer text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("loggingIn")}
                  </>
                ) : (
                  <span>{t("login")}</span>
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
          <CardFooter className="flex flex-col">
            <p className="text-xs text-center  text-secondary-foreground mt-4">
              {t("terms")}
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
};

export default LoginDesktop;
