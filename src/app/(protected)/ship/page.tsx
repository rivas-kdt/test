"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Camera,
  ArrowDownToLine,
  Loader2,
  Minus,
} from "lucide-react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/useMobile";
import { useTranslations } from "next-intl";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useShipHooks } from "@/features/ship/hooks/shipHooks";
import { useShippingActions } from "@/features/ship/hooks/shippingActions";
import QrScanner from "@/components/qr-scanner";
import toast from "react-hot-toast";
import { useTheme } from "next-themes";
import { useSession } from "@/features/auth/hooks/sessionProvider";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface WarehouseItem {
  id: string;
  product_code: string;
  stock_no: string;
  lot_no: string;
  description: string;
  quantity: number;
  selected: boolean;
  ship_quantity: number | string;
}

export default function ShippedView() {
  const router = useRouter();
  const { user } = useAuth();

  console.log("Current user in ShippedView:", user);

  const [scanning, setScanning] = useState(false);
  const [highlightedItem, setHighlightedItem] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const t = useTranslations("stock/ship");
  const { theme } = useTheme();

  useEffect(() => {
    if (isMobile === undefined) return;

    if (!isMobile) {
      router.push("/dashboard");
    }
  }, [isMobile, router]);

  const {
    loading,
    fetching,
    stockedParts,
    toggleItemSelection,
    shipParts,
    handleScan,
    moveSelectedItems,
    removeFromShipping,
    handleInputChange,
    selectedItems,
  } = useShipHooks({
    t,
    setScanning,
    setHighlightedItem,
  });

  console.log("fetching: ", fetching);
  
  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col w-screen p-4 pt-20  bg-linear-to-b from-primary/10 to-background">
        {/* Back Button */}
        <Link href="/test">
          <Button
            variant="ghost"
            size="icon"
            className="active:bg-primary transition"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-2xl font-medium ml-2 mb-2">{t("ship-items")}</h1>
        {/* QR Scanner */}
        {scanning ? (
          <Card className="mb-4">
            <CardContent className="p-4">
              <QrScanner
                onScan={(data: string) => handleScan(data)}
                onClose={() => setScanning(false)}
              />
            </CardContent>
          </Card>
        ) : (
          <Button
            className="mb-4 bg-primary text-md py-6"
            onClick={() => setScanning(true)}
          >
            <Camera style={{ width: "20px", height: "20px" }} />
            {t("b1")}
          </Button>
        )}
        {/* Table 1: Stocked Items */}
        <Card className="mb-4">
          <CardHeader className="py-2">
            <CardTitle className="text-lg">{t("ship-title1")}</CardTitle>
          </CardHeader>
          <CardContent className="overflow-auto max-h-[30vh]">
            {fetching ? (
              <div className="flex justify-center items-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                <p>{t("loading-items")}</p>
              </div>
            ) : stockedParts.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <p>{t("no-items-warehouse")}</p>
              </div>
            ) : (
              <div className="relative max-h-[500px] overflow-auto">
                <Table className="w-full min-w-[800px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        className="sticky left-0 z-30"
                        style={{
                          backgroundColor:
                            theme === "dark" ? "#131D34" : "#ffffff",
                        }}
                      >
                        {t("select")}
                      </TableHead>
                      <TableHead
                        style={{
                          backgroundColor:
                            theme === "dark" ? "#131D34" : "#ffffff",
                        }}
                      >
                        {t("th1")}
                      </TableHead>
                      <TableHead
                        style={{
                          backgroundColor:
                            theme === "dark" ? "#131D34" : "#ffffff",
                        }}
                      >
                        {t("th2")}
                      </TableHead>
                      <TableHead
                        style={{
                          backgroundColor:
                            theme === "dark" ? "#131D34" : "#ffffff",
                        }}
                      >
                        {t("th3")}
                      </TableHead>
                      <TableHead
                        style={{
                          backgroundColor:
                            theme === "dark" ? "#131D34" : "#ffffff",
                        }}
                      >
                        {t("th4")}
                      </TableHead>
                      <TableHead
                        style={{
                          backgroundColor:
                            theme === "dark" ? "#131D34" : "#ffffff",
                        }}
                      >
                        {t("th5")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="whitespace-nowrap">
                    {stockedParts
                      .filter((item) => item.quantity > 0 && !item.added)
                      .map((item) => (
                        <TableRow
                          key={item.lot_no}
                          className={
                            highlightedItem === item.lot_no
                              ? "bg-primary/10"
                              : ""
                          }
                        >
                          <TableCell
                            className="sticky left-0 z-10 pl-0 flex items-center justify-center"
                            style={{
                              backgroundColor:
                                theme === "dark" ? "#131D34" : "#ffffff",
                            }}
                          >
                            <Checkbox
                              checked={item.selected}
                              onCheckedChange={() => toggleItemSelection(item)}
                            />
                          </TableCell>
                          <TableCell>{item.lot_no}</TableCell>
                          <TableCell>{item.product_code}</TableCell>
                          <TableCell>{item.stock_no}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          <div className="p-2">
            <Button
              onClick={() => {
                moveSelectedItems(stockedParts, setHighlightedItem);
                // toggleItemAdded(stockedParts);
                stockedParts
                  .filter((item) => item.selected)
                  .forEach((item) => {
                    // Use setTimeout to ensure toast renders after state updates
                    setTimeout(() => {
                      toast.success(`${t("itemAdded")}: ${item.lot_no}`, {
                        duration: 2000,
                      });
                    }, 0);
                  });
              }}
              disabled={!stockedParts.some((item) => item.selected)}
              className="w-full bg-primary text-md h-[50px]"
            >
              <ArrowDownToLine style={{ width: "20px", height: "20px" }} />
              {t("b3")}
            </Button>
          </div>
        </Card>
        {/* Table 2: Items to Ship */}
        <Card className="mb-4">
          <CardHeader className="py-2">
            <CardTitle className="text-lg">{t("ship-title2")}</CardTitle>
          </CardHeader>
          <CardContent className="overflow-hidden">
            {selectedItems.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <p>{t("no-added-items")}</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="whitespace-nowrap">
                    {/* FIXME try na di mawala yung table head pag nag scroll down */}
                    <TableHead
                      className="py-0"
                      style={{
                        backgroundColor:
                          theme === "dark" ? "#131D34" : "#ffffff",
                      }}
                    >
                      {t("th1")}
                    </TableHead>
                    <TableHead
                      style={{
                        backgroundColor:
                          theme === "dark" ? "#131D34" : "#ffffff",
                      }}
                    >
                      {t("th2")}
                    </TableHead>
                    <TableHead
                      style={{
                        backgroundColor:
                          theme === "dark" ? "#131D34" : "#ffffff",
                      }}
                    >
                      {t("th3")}
                    </TableHead>
                    <TableHead
                      style={{
                        backgroundColor:
                          theme === "dark" ? "#131D34" : "#ffffff",
                      }}
                    >
                      {t("th4")}
                    </TableHead>
                    <TableHead
                      style={{
                        backgroundColor:
                          theme === "dark" ? "#131D34" : "#ffffff",
                      }}
                    >
                      {t("stock")}
                    </TableHead>
                    <TableHead
                      style={{
                        backgroundColor:
                          theme === "dark" ? "#131D34" : "#ffffff",
                      }}
                    >
                      {t("th5")}
                    </TableHead>
                    <TableHead
                      className="w-[80px]"
                      style={{
                        backgroundColor:
                          theme === "dark" ? "#131D34" : "#ffffff",
                      }}
                    >
                      {t("remove")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="whitespace-nowrap">
                  {selectedItems.map((item, index) => (
                    <TableRow key={item.lot_no}>
                      <TableCell className="whitespace-nowrap">
                        {item.lot_no}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {item.product_code}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {item.stock_no}
                      </TableCell>
                      <TableCell className="min-w-[250px] whitespace-normal text-start">
                        {item.description}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-center">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Input
                          type="number"
                          min="1"
                          max={item.quantity}
                          className="w-20 p-1 border rounded-md"
                          value={
                            item.ship_quantity === ""
                              ? ""
                              : String(item.ship_quantity)
                          }
                          onChange={(e) => handleInputChange(e, index)}
                        />
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            removeFromShipping(item);
                            toast.success(
                              t("removeItem", { lotNo: item.lot_no }),
                              {
                                duration: 2000,
                              }
                            );
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-4 w-4" />
                          <span className="sr-only">{t("remove")}</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        {/* Ship Button */}
        <Button
          className="w-full py-6 mt-auto bg-primary mb-4 text-md h-[50px]"
          disabled={loading || selectedItems.length === 0}
          onClick={() => shipParts(selectedItems)}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {t("processing")}
            </>
          ) : (
            <>
              {t("ship")} ({selectedItems.length})
            </>
          )}
        </Button>
      </div>
    </ScrollArea>
  );
}
