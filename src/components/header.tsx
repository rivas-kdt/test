"use client";

import { ChevronDown, Home, LogOut, Menu, Package } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ThemeToggle } from "./theme-toggle";
import { useTheme } from "next-themes";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useIsMobile } from "../hooks/useMobile";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import LocaleSwitcher from "./localeSwitcher";
import { useTranslations } from "next-intl";
// import { deleteSession } from "@/actions/cookieHandler";
import { Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { LanguageIcon } from "@heroicons/react/24/solid";
import { Switch } from "./ui/switch";
import LocaleSwitcherSelect from "./localeSwitcherSelector";
import LocaleSwitcherDropdown from "./localeSwitcherDropdown";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth(false);
  const { resolvedTheme, setTheme } = useTheme();
  const isMobile = useIsMobile();
  const t = useTranslations("Header");
  const [loading2, setLoading2] = useState(true);
  const [menuLoading, setMenuLoading] = useState(false);

  useEffect(() => {
    if (isMobile !== undefined) {
      setLoading2(false);
    }
  }, [isMobile]);

  useEffect(() => {
    if (pathname === "/transactions") {
      setMenuLoading(false);
    }
  }, [pathname]);

  if (
    pathname === "/login" ||
    pathname === "/reset-password" ||
    pathname === "/confirm-email"
  ) {
    return null;
  }

  //   const handleLogout = async () => {
  //     if (window.confirm("Are you sure you want to log out?")) {
  //       await deleteSession();
  //       localStorage.removeItem("token");
  //       sessionStorage.removeItem("selectedWarehouseId");
  //       sessionStorage.removeItem("selectedWarehouse");
  //       router.push("/login");
  //     }
  //   };

  if (loading2) {
    return (
      <div className="w-screen h-[80px] flex items-center justify-between p-4">
        <Skeleton className=" h-full w-[200px]" />
        <Skeleton className=" h-full w-[600px]" />
        <Skeleton className=" h-full w-[300px]" />
      </div>
    );
  }

  // Mobile Header
  if (isMobile) {
    return (
      <>
        <div className="fixed top-0 left-0 w-full z-50 px-4 pt-5 pb-.5 bg-background border-b border-b-gray-300">
          <div className="flex justify-between items-center mb-2">
            <div className="relative inline-block">
              <div className="text-3xl font-bold tracking-tighter text-primary flex">
                <span>X</span>
                <span className="relative opacity-80">
                  Mo
                  <span className="relative inline-block">
                    n
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-background text-xs px-1.5 py-0.5 rounded-full font-bold">
                      KDT
                    </span>
                  </span>
                </span>
              </div>
              <div>
                <p className="text-xs">{t("p1")}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-muted hover:bg-muted/50 text-primary hover:text-muted-foreground/50 backdrop-blur-sm border-muted cursor-pointer"
                  >
                    <Menu className="h-[22px] w-[22px] text-primary" />
                  </Button>
                </SheetTrigger>

                <SheetContent side="right" className="w-64">
                  <div className="p-4">
                    <div className="flex flex-col gap-4 pb-4">
                      <button
                        onClick={() => router.push("/test")}
                        className={`flex items-center gap-2 ${
                          pathname === "/test"
                            ? "underline decoration-2 underline-offset-4 font-medium"
                            : ""
                        }`}
                      >
                        <div className="p-2 border border-muted rounded-full">
                          <Home className="h-[1.2rem] w-[1.2rem]" />
                        </div>
                        {t("home")}
                      </button>

                      <button
                        onClick={() => {
                          setMenuLoading(true);
                          router.push("/transactions");
                        }}
                        className={`flex items-center gap-2 ${
                          pathname === "/transactions"
                            ? "underline decoration-2 underline-offset-4 font-medium"
                            : ""
                        }`}
                      >
                        <div className="p-2 border border-muted rounded-full">
                          <Package className="h-[1.2rem] w-[1.2rem]" />
                        </div>
                        {t("transaction")}
                      </button>
                    </div>
                    <hr className="border-gray-300" />
                    <div className="py-4">
                      <div className="flex items-center justify-between gap-2 pb-4">
                        <div className="flex items-center gap-2">
                          <ThemeToggle />
                          <span className="text-sm capitalize">
                            Theme: <strong>{resolvedTheme}</strong>
                          </span>
                        </div>
                        <Switch
                          checked={resolvedTheme === "dark"}
                          onCheckedChange={() =>
                            setTheme(
                              resolvedTheme === "light" ? "dark" : "light"
                            )
                          }
                        />
                      </div>
                      <LocaleSwitcherDropdown />
                    </div>
                  </div>
                  <div className="absolute bottom-0 w-full ">
                    <div className="border-t border-gray-300 px-4 py-4">
                      <button
                        // onClick={handleLogout}
                        className="flex items-center gap-2 p-2"
                      >
                        <LogOut className="h-[1.2rem] w-[1.2rem]" />

                        {t("logout")}
                      </button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {menuLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-black/80">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        )}
      </>
    );
  }

  // Desktop Header
  return (
    <div className="h-[80px] w-full flex justify-between items-center p-4">
      <div className="flex w-full gap-16">
        <div className="flex items-center">
          <div
            className="relative mr-4 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <div className="text-4xl font-bold tracking-tighter text-primary">
              <span>X</span>
              <span className="opacity-80">{t("mon")}</span>
            </div>
            <div className="absolute -top-2 -right-2 bg-accent text-background text-xs px-1.5 py-0.5 rounded-full font-bold">
              KDT
            </div>
          </div>
          <div>
            <h1 className=" md:hidden lg:block text-xl font-bold">{t("p1")}</h1>
          </div>
        </div>
        <nav className="flex items-center space-x-4 lg:space-x-6">
          <Link
            href="/admin"
            className={`${
              pathname === "/admin" ? "" : "text-muted-foreground"
            } font-medium transition-colors hover:text-primary`}
          >
            {t("admin")}
          </Link>
          <Link
            href="/dashboard"
            className={`${
              pathname === "/dashboard" ? "" : "text-muted-foreground"
            } font-medium transition-colors hover:text-primary`}
          >
            {t("dashboard")}
          </Link>
          <Link
            href="/inventory"
            className={`${
              pathname === "/inventory" ? "" : "text-muted-foreground"
            } font-medium transition-colors hover:text-primary`}
          >
            {t("inventory")}
          </Link>
          <Link
            href="/transactions"
            className={`${
              pathname === "/transactions" ? "" : "text-muted-foreground"
            } font-medium transition-colors hover:text-primary`}
          >
            {t("transaction")}
          </Link>
          <Link
            href="/email-history"
            className={`${
              pathname === "/email-history" ? "" : "text-muted-foreground"
            } font-medium transition-colors hover:text-primary`}
          >
            {t("email-history")}
          </Link>
        </nav>
        <div className=" flex-1 flex justify-end gap-2">
          <LocaleSwitcher />
          <ThemeToggle />
          <Button
            size={"default"}
            // onClick={handleLogout}
            className=" bg-destructive hover:bg-destructive/80"
          >
            <LogOut className="h-[1.2rem] w-[1.2rem] p-.5" />
            <span className=" md:hidden lg:block">{t("logout")}</span>
          </Button>
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon">
                <Menu className="h-8 w-8 text-primary-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <ThemeToggle />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <div className="p-2 border border-muted rounded-full">
                  <LogOut className="h-[1.2rem] w-[1.2rem] p-.5" />
                </div>
                <p className="ml-1">Logout</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      </div>
    </div>
  );
}
