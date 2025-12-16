import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import { stockParts } from "../services/StockParts";
import { ScannedItem, StockItemPayload } from "@/types/stock";
import { v4 as uuidv4 } from "uuid";
import { useWarehouse } from "@/context/warehouseContext";
import jsQR from "jsqr";
import { useTranslations } from "next-intl";

export function useStockActions() {
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
  const [receipt, setReceipt] = useState<string | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileQRInputRef = useRef<HTMLInputElement>(null);
  const { warehouseId } = useWarehouse();

  const t = useTranslations("stock/ship");

  const handleUploadQRImage = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      await new Promise((resolve) => (img.onload = resolve));

      // Draw onto canvas so jsQR can read it
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error(t("canvasContextErr"));

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

      if (!qrCode) {
        toast.error(t("noQR"));
        return;
      }

      toast.success(t("qrDecoded"));
      handleScan(qrCode.data); // <-- same flow as live camera scan
    } catch (err) {
      console.error("QR image decode error:", err);
      toast.error(t("qrReadFail"));
    } finally {
      if (fileQRInputRef.current) fileQRInputRef.current.value = "";
    }
  };

  // -----------------------------
  // QR Scanner Handler
  // -----------------------------
  const handleScan = (data: string) => {
    if (!data) return;

    try {
      const values = data.split(",");
      if (values.length < 6) {
        toast.error(t("qrFormatErr"));
        return;
      }

      const item: ScannedItem = {
        id: uuidv4(),
        productCode: values[1],
        stockNo: values[3],
        description: values[4],
        lotNo: values[5],
        quantity: Number(values[6]) || 1,
      };

      setScannedItems((prev) => [...prev, item]);
      toast.success(`${t("addedItem")}: ${item.lotNo}`);
    } catch (error) {
      toast.error(t("qrParsingErr"));
    }

    setScanning(false);
  };

  // -----------------------------
  // Quantity Change
  // -----------------------------
  const handleQuantityChange = (id: string, newValue: string) => {
    const q = Number(newValue);

    setScannedItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: q || 0 } : i))
    );
  };

  // -----------------------------
  // Receipt Upload (Image → Base64)
  // -----------------------------
  const handleUploadReceiptFile = (file: File) => {
    if (!file) return;

    setReceiptFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setReceipt(base64);
      sessionStorage.setItem("receiptImage", base64);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadReceipt = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUploadReceiptFile(file);
  };

  // -----------------------------
  // Stock Items Logic
  // -----------------------------
  const handleStockItems = async () => {
    if (!warehouseId) {
      toast.error(t("noWarehouse"));
      return;
    }

    if (scannedItems.length === 0) {
      toast.error(t("scanItem"));
      return;
    }

    if (!receiptFile) {
      toast.error(t("uploadReceipt"));
      return;
    }

    if (scannedItems.some((i) => i.quantity < 1)) {
      toast.error(t("qtyInvalid"));
      return;
    }

    setLoading(true);

    try {
      // Upload receipt image
      const fileExt = receiptFile.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;

      const { error: uploadErr } = await supabase.storage
        .from("xmon-storage")
        .upload(`receipts/${fileName}`, receiptFile);

      if (uploadErr) {
        toast.error(t("receiptFail"));
        return;
      }

      const { data: urlData } = supabase.storage
        .from("xmon-storage")
        .getPublicUrl(`receipts/${fileName}`);

      const receiptUrl = urlData.publicUrl;

      // Stock each item
      for (const item of scannedItems) {
        const payload: StockItemPayload = {
          lotNo: item.lotNo,
          stockNo: item.stockNo,
          productCode: item.productCode,
          description: item.description,
          quantity: item.quantity,
          warehouseId,
          receiptUrl,
        };

        const result = await stockParts(payload);

        if (result.error) {
          toast.error(result.error);
        }
      }

      toast.success(t("stockSuccess"));

      // reset
      setScannedItems([]);
      setReceipt(null);
      setReceiptFile(null);
      sessionStorage.removeItem("receiptImage");
    } catch (error) {
      toast.error(t("stockError"));
    } finally {
      setLoading(false);
    }
  };

  return {
    scannedItems,
    receipt,
    receiptFile,
    scanning,
    loading,
    fileInputRef,
    fileQRInputRef,
    setScanning,
    handleScan,
    handleQuantityChange,
    handleUploadReceipt,
    handleStockItems,
    handleUploadQRImage,
  };
}
