"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import LocaleSwitcher from "@/components/localeSwitcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function ConfirmEmailDesktop() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const t = useTranslations("confirm-email");

  const handleSendRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailTrimmed = email.trim(); // make sure to trim input

    if (!emailTrimmed) {
      toast.error(t("plsEnterEmail"));
      return;
    }

    const isValidEmail = (email: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isValidEmail(emailTrimmed)) {
      toast.error(t("plsValidEmail"));
      return;
    }

    setLoading(true);

    // try {
    //   const res = await fetch("/api/forget-password/email", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ email: emailTrimmed }),
    //   });

    //   if (!res.ok) {
    //     let errorMessage = "Failed to send reset link. Please try again.";
    //     try {
    //       const data = await res.json();
    //       if (data?.error) errorMessage = data.error.message || data.error;
    //     } catch {
    //       const text = await res.text();
    //       console.error("Non-JSON response:", text);
    //     }
    //     toast.error(errorMessage);
    //     return;
    //   }

    //   toast.success("Reset link sent to your email!");
    // } catch (err) {
    //   console.error("Network or server error:", err);
    //   toast.error(t("error"));
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
              {t("confirmEmail")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendRequest} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-secondary-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("enterEmail")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                className="w-full bg-primary"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("sending")}
                  </>
                ) : (
                  t("send")
                )}
              </Button>
            </form>
          </CardContent>
          <div className="mb-4 -mt-2 text-[12px] flex justify-center items-center">
            {t("returnLogin")}?
            <a
              href="#"
              className="ml-1 text-blue-400"
              onClick={(e) => {
                e.preventDefault();
                router.push("/login");
              }}
            >
              {t("clickHere")}
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
