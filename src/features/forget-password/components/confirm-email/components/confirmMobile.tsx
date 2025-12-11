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

export default function ConfirmEmailMobile() {
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
    // }
  };

  return (
    <div className="flex flex-col w-screen p-4 pt-20 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="absolute top-4 right-4 z-10 flex gap-4">
        <LocaleSwitcher />
        <ThemeToggle />
      </div>
      {/* Back Button */}
      <Link href="/">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-6 w-6 -ml-4" />
        </Button>
      </Link>
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
            {t("confirmEmail")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendRequest} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
        <div className="mb-2 -mt-2 text-[12px] flex justify-center items-center">
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
  );
}
