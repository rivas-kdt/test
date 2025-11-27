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
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStockActions } from "@/features/stock/hooks/useStockHooks";
import { ArrowLeft, Camera, Trash2, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function StockView() {
  const t = useTranslations("stock/ship");

  // Hook gives us everything
  const {
    scanning,
    setScanning,
    scannedItems,
    receipt,
    fileInputRef,
    loading,
    handleScan,
    handleQuantityChange,
    handleUploadReceipt,
    handleStockItems,
  } = useStockActions();

  // For manual QR simulation
//   const [simulateDialog, setSimulateDialog] = useState(false);
//   const [simulatedQR, setSimulatedQR] = useState("");

  return (
    <div className="flex flex-col w-screen p-4 pt-20 bg-gradient-to-b from-primary/10 to-background">
      {/* Back Button */}
      <Link href="/">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </Link>

      <h1 className="text-xl font-bold ml-2 mb-2">{t("stock-items")}</h1>

      {/* Scanner + Simulation Controls */}
      {scanning ? (
        <Card className="mb-4">
          <CardContent className="p-.5">
            <QrScanner
              onScan={handleScan}
              onClose={() => setScanning(false)}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="flex gap-2 w-full mb-4">
          <Button
            onClick={() => setScanning(true)}
            className="bg-primary text-md w-full h-[50px]"
          >
            <Camera className="mr-2" />
            {t("scanqr")}
          </Button>

          {/* Manual simulation button */}
          {/* <Button
            variant="outline"
            className="h-[50px] w-full"
            onClick={() => setSimulateDialog(true)}
          >
            Simulate QR
          </Button> */}
        </div>
      )}

      {/* Simulate QR Dialog */}
      {/* <Dialog open={simulateDialog} onOpenChange={setSimulateDialog}>
        <DialogContent className="max-w-md">
          <DialogTitle>Simulate QR Scan</DialogTitle>
          <p className="text-sm text-muted-foreground mb-2">
            Paste a QR value here (comma-separated):
          </p>

          <Input
            placeholder="e.g. TEST,PCODE,XYZ,STOCK,Description,LOT123,10"
            value={simulatedQR}
            onChange={(e) => setSimulatedQR(e.target.value)}
            className="mb-4"
          />

          <Button
            className="w-full"
            onClick={() => {
              if (!simulatedQR.trim()) {
                toast.error("Enter QR data");
                return;
              }
              handleScan(simulatedQR.trim());
              setSimulateDialog(false);
              setSimulatedQR("");
            }}
          >
            Apply
          </Button>
        </DialogContent>
      </Dialog> */}

      {/* Scanned Items Table */}
      <div className="relative max-h-[500px] overflow-auto">
        <Table className="w-full">
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
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.id, e.target.value)
                    }
                    className="w-20"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Upload hidden input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleUploadReceipt}
      />

      {/* Upload Button */}
      {!receipt && (
        <Button
          className="bg-primary mt-4 mb-4 h-[50px] w-full"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mr-2" /> {t("upload")}
        </Button>
      )}

      {/* Receipt Preview */}
      {receipt && (
        <Card className="my-4 relative">
          <CardContent className="p-4 flex items-start justify-between">
            <Dialog>
              <DialogTrigger asChild>
                <img
                  src={receipt}
                  alt="Receipt"
                  className="max-h-48 object-contain cursor-zoom-in mx-auto"
                />
              </DialogTrigger>

              <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
                <VisuallyHidden>
                  <DialogTitle>View Receipt</DialogTitle>
                </VisuallyHidden>

                <TransformWrapper>
                  <TransformComponent>
                    <img
                      src={receipt}
                      className="max-w-full max-h-full object-contain"
                    />
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
                window.location.reload();
              }}
            >
              <Trash2 />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Final Submit Button */}
      <Button
        onClick={handleStockItems}
        disabled={loading || scannedItems.length === 0 || !receipt}
        className="w-full h-[50px] mt-4 bg-primary"
      >
        {loading ? t("processing") : t("stock")}
      </Button>
      {/* <button onClick={handleStockItems}>Stock</button> */}
    </div>
  );
}
