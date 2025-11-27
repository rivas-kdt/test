"use client";
import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Package, Truck, MapPin, Loader2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/loader";
import { useLanding } from "@/features/landing/hooks/useLanding";
import { useAuth } from "@/features/auth/hooks/auth-context";

const LandingContent = () => {
    const t = useTranslations("landing-page");
    const router = useRouter();
    const { session } = useAuth();
    const isAdmin = session?.user?.role === "admin";

    const {
        warehouse,
        warehouseLoading,
        selectedWarehouse,
        handleWarehouseChange,
        selectedLocation,
    } = useLanding();
    
    const [loading, setLoading] = useState(false);

    return (
        <main className="flex flex-col w-screen min-h-screen p-4 pt-24 bg-linear-to-b from-primary/10 to-background">
            <Card className="mb-4 border-0 shadow-md">
                <CardHeader className="pb-2">
                    <CardTitle className="text-2xl font-medium">
                        {t("welcome-message")}
                    </CardTitle>
                    <CardDescription className="text-xl font-medium text-primary">
                        {session?.user?.username || t("guest")}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {isAdmin ? (
                            <>
                                <label className="flex text-md font-medium">
                                    {t("selectWarehouse")}
                                </label>
                                <Select
                                    value={selectedWarehouse?.id}
                                    onValueChange={handleWarehouseChange}
                                    disabled={warehouseLoading}
                                >
                                    <SelectTrigger className="flex w-full h-[50px]">
                                        <SelectValue placeholder={t("selectWarehouse")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {warehouseLoading ? (
                                            <div className="flex items-center justify-center py-2 h-[50px] text-md">
                                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                <span>{t("loading")}</span>
                                            </div>
                                        ) : (
                                            warehouse.map((warehouse: any) => (
                                                <SelectItem
                                                    key={warehouse.id}
                                                    value={warehouse.id}
                                                    className="py-4"
                                                >
                                                    {warehouse.warehouse}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </>
                        ) : (
                            <div className="bg-muted/50 p-3 rounded-md">
                                <p className="text-sm font-medium">{t("assigned")}</p>
                                <p className="text-base font-semibold">
                                    {selectedWarehouse?.warehouse || t("errorXAssign")}
                                </p>
                            </div>
                        )}
                        {isAdmin
                            ? selectedWarehouse && (
                                <div className="mt-2">
                                    <label className="text-md font-medium flex mb-2">
                                        {t("location")}
                                    </label>
                                    <div className="flex items-center p-2 border rounded-md bg-muted/30 h-[50px]">
                                        <MapPin className="h-4 w-4 mr-2" />
                                        <span className="text-sm">
                                            {selectedWarehouse?.location || t("errorLocX")}
                                        </span>
                                    </div>
                                </div>
                            )
                            : selectedWarehouse && (
                                <div className="mt-2">
                                    <label className="text-sm font-medium">
                                        {t("location")}
                                    </label>
                                    <div className="flex items-center p-2 border rounded-md bg-muted/30">
                                        <MapPin className="h-4 w-4 mr-2" />
                                        <span className="text-sm">
                                            {selectedLocation || t("errorLocX")}
                                        </span>
                                    </div>
                                </div>
                            )}
                    </div>
                </CardContent>
            </Card>
            <div className="grid gap-4">
                <Button
                    className="py-8 flex items-center justify-center gap-2 rounded-xl shadow-md bg-primary w-full"
                    onClick={() => {
                        setLoading(true);
                        router.push("/stock");
                    }}
                    disabled={loading}
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <Package style={{ width: "25px", height: "25px" }} />
                            <span className="text-lg">{t("stockItem")}</span>
                        </>
                    )}
                </Button>

                <Button
                    className="py-8 flex items-center justify-center gap-2 rounded-xl shadow-md bg-primary w-full"
                    onClick={() => {
                        setLoading(true);
                        router.push("/ship");
                    }}
                    disabled={loading}
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <Truck style={{ width: "25px", height: "25px" }} />
                            <span className="text-lg">{t("shipItem")}</span>
                        </>
                    )}
                </Button>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-auto pt-4">
                {t("p1")}
            </p>

            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-black/80">
                    <Loader />
                </div>
            )}
        </main>
    )
}

export default LandingContent