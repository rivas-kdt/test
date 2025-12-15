"use client";

import QrScanner from "@/components/qr-scanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ArrowLeft, Camera, Trash2, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { useStockActions } from "@/features/stock/hooks/useStockHooks";

export default function StockView() {
  const t = useTranslations("stock/ship");

  const {
    scanning,
    setScanning,
    scannedItems,
    receipt,
    fileInputRef,
    fileQRInputRef,
    loading,
    handleScan,
    handleQuantityChange,
    handleUploadReceipt,
    handleStockItems,
    handleUploadQRImage,
  } = useStockActions();

  return (
    <div className="flex flex-col w-screen px-4 pt-20 bg-linear-to-b from-primary/10 to-background">
      <Link href="/">
        <Button
          variant="ghost"
          size="icon"
          className="active:bg-primary transition"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </Link>

      <h1 className="text-xl font-bold ml-2 mb-2">{t("stock-items")}</h1>

      {/* Scanner */}
      {scanning ? (
        <Card className="mb-4">
          <CardContent className="p-1">
            <QrScanner onScan={handleScan} onClose={() => setScanning(false)} />
          </CardContent>
        </Card>
      ) : (
        <>
          <Button
            className="w-full h-[50px] mb-4 bg-primary"
            onClick={() => setScanning(true)}
          >
            <Camera className="mr-2" />
            {t("scanqr")}
          </Button>
          <Button
            variant="outline"
            className="bg-secondary w-full h-[50px]"
            onClick={() => fileQRInputRef.current?.click()}
          >
            {/* <img src="./qr-file.svg" className="w-4 h-4 mr-1.5" /> */}
            {t("uploadqr")}
          </Button>

          <input
            ref={fileQRInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUploadQRImage}
          />
        </>
      )}

      {/* Scanned Items Table */}
      <div className="relative max-h-[500px] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("lotNo")}</TableHead>
              <TableHead>{t("prodNo")}</TableHead>
              <TableHead>{t("stockNo")}</TableHead>
              <TableHead>{t("desc")}</TableHead>
              <TableHead>{t("quantity")}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {scannedItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.lotNo}</TableCell>
                <TableCell>{item.productCode}</TableCell>
                <TableCell>{item.stockNo}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="1"
                    className="w-20"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.id, e.target.value)
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUploadReceipt}
      />

      {/* Upload Receipt Button */}
      {!receipt && (
        <Button
          className="w-full h-[50px] mb-4 mt-4 bg-primary"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mr-2" />
          {t("upload")}
        </Button>
      )}

      {/* Receipt Image Preview */}
      {receipt && (
        <Card className="relative my-4">
          <CardContent className="p-4">
            <Dialog>
              <DialogTrigger asChild>
                <img
                  src={receipt}
                  className="max-h-48 object-contain cursor-zoom-in"
                />
              </DialogTrigger>

              <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
                <VisuallyHidden>
                  <DialogTitle>Receipt</DialogTitle>
                </VisuallyHidden>

                <TransformWrapper>
                  <TransformComponent>
                    <img src={receipt} className="max-w-full max-h-full" />
                  </TransformComponent>
                </TransformWrapper>
              </DialogContent>
            </Dialog>

            <Button
              variant="destructive"
              size="icon"
              className="absolute top-4 right-4"
              onClick={() => {
                sessionStorage.removeItem("receiptImage");
                toast.success("Removed receipt");
                window.location.reload();
              }}
            >
              <Trash2 />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Final Submit */}
      <Button
        disabled={loading || scannedItems.length === 0 || !receipt}
        onClick={handleStockItems}
        className="w-full h-[50px] bg-primary"
      >
        {loading ? t("processing") : t("stock")}
      </Button>
    </div>
  );
}
