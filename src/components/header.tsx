"use client";

import { Home, LogOut, Menu, Package } from "lucide-react";

import Link from "next/link";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { useAuth } from "@/features/auth/hooks/auth-context";
import { useIsMobile } from "@/hooks/useMobile";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";

import LocaleSwitcher from "@/components/localeSwitcher";
import LocaleSwitcherDropdown from "@/components/localeSwitcherDropdown";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const { logout } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const isMobile = useIsMobile();

  const t = useTranslations("Header");

  const hiddenPages = ["/login", "/reset-password", "/confirm-email"];
  if (hiddenPages.includes(pathname)) return null;

  const NAV_LINKS = [
    { href: "/admin", label: t("admin") },
    { href: "/", label: t("dashboard") },
    { href: "/inventory", label: t("inventory") },
    { href: "/transactions", label: t("transaction") },
    { href: "/email-history", label: t("email-history") },
  ];

  const handleLogout = () => logout();

  // ---------------------------------------------------------------------------
  // MOBILE HEADER
  // ---------------------------------------------------------------------------
  if (isMobile) {
    return (
      <>
        <header className="fixed top-0 left-0 w-full z-50 px-4 py-3 bg-background border-b">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div
              className="cursor-pointer select-none"
              onClick={() => router.push("/")}
            >
              <div className="text-3xl font-bold tracking-tight text-primary flex">
                <span>X</span>
                <span className="opacity-80 relative">
                  Mo
                  <span className="relative inline-block">
                    n
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-background text-xs px-1.5 py-0.5 rounded-full font-bold">
                      KDT
                    </span>
                  </span>
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{t("p1")}</p>
            </div>

            {/* Menu Drawer */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-muted hover:bg-muted/70"
                >
                  <Menu className="h-5 w-5 text-primary" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className=" px-4">
                <div className="flex flex-col h-full">
                  {/* Navigation */}
                  <nav className="flex flex-col gap-4 py-4">
                    <MobileNavLink
                      icon={<Home className="h-5 w-5" />}
                      label={t("home")}
                      href="/"
                      active={pathname === "/"}
                      router={router}
                    />

                    <MobileNavLink
                      icon={<Package className="h-5 w-5" />}
                      label={t("transaction")}
                      href="/transactions"
                      active={pathname === "/transactions"}
                      router={router}
                    />
                  </nav>

                  <hr className="my-2" />

                  {/* Theme & Locale */}
                  <div className="flex flex-col gap-4 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <span className="text-sm">
                          {t("theme")}: <strong>{resolvedTheme}</strong>
                        </span>
                      </div>

                      <Switch
                        checked={resolvedTheme === "dark"}
                        onCheckedChange={() =>
                          setTheme(resolvedTheme === "light" ? "dark" : "light")
                        }
                      />
                    </div>

                    <LocaleSwitcherDropdown />
                  </div>

                  {/* Logout */}
                  <div className="mt-auto border-t pt-4">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 p-2 text-destructive"
                    >
                      <LogOut className="h-5 w-5" />
                      {t("logout")}
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>
        <div className="h-[80px]" /> {/* spacing under fixed header */}
      </>
    );
  }

  // ---------------------------------------------------------------------------
  // DESKTOP HEADER
  // ---------------------------------------------------------------------------
  return (
    <header className="h-20 w-full flex items-center justify-between p-4 border-b bg-background">
      {/* Logo */}
      <div className="relative cursor-pointer" onClick={() => router.push("/")}>
        <div className="text-4xl font-bold tracking-tight text-primary">
          <span>X</span>
          <span className="opacity-80">{t("mon")}</span>
        </div>
        <div className="absolute -top-2 -right-2 bg-accent text-background text-xs px-1.5 py-0.5 rounded-full font-bold">
          KDT
        </div>
      </div>

      {/* Desktop Nav */}
      <nav className="flex gap-6">
        {NAV_LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`transition font-medium ${
                active
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Controls */}
      <div className="flex gap-2 items-center">
        <LocaleSwitcher />
        <ThemeToggle />

        <Button
          size="default"
          onClick={handleLogout}
          className="bg-destructive hover:bg-destructive/80"
        >
          <LogOut className="h-[1.2rem] w-[1.2rem] mr-1" />
          {t("logout")}
        </Button>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// Small Extracted Component for Clean Mobile Nav Buttons
// ---------------------------------------------------------------------------

function MobileNavLink({
  icon,
  label,
  href,
  active,
  router,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  active: boolean;
  router: any;
}) {
  return (
    <button
      onClick={() => router.push(href)}
      className={`flex items-center gap-3 text-left ${
        active ? "text-primary font-medium" : ""
      }`}
    >
      <div
        className={`p-2 border rounded-full ${
          active ? "border-primary" : "border-muted"
        }`}
      >
        {icon}
      </div>
      {label}
    </button>
  );
}
