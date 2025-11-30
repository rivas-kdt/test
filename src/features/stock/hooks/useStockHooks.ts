import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import { stockParts } from "../services/StockParts";
import { v4 as uuidv4 } from "uuid";

export function useStockActions() {
  const [scannedItems, setScannedItems] = useState<any[]>([]);
  const [receipt, setReceipt] = useState<string | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScan = (data: string) => {
    if (!data) return;

    try {
      const values = data.split(",");
      if (values.length < 7) {
        toast.error("QR code format is incorrect.");
        return;
      }

      const productCode = values[1];
      const stockNo = values[3];
      const description = values[4];
      const lotNo = values[5];
      const quantity = Number(values[6]);

      const newItem = {
        id: Date.now().toString(),
        productCode,
        stockNo,
        lotNo,
        description,
        quantity,
      };

      setScannedItems((prev) => [...prev, newItem]);

      toast.success(`Added item: ${lotNo}`);
    } catch (error) {
      console.error("QR error:", error);
      toast.error("QR error");
    }

    setScanning(false);
  };

  const handleQuantityChange = (id: string, newQ: string) => {
    const q = parseInt(newQ);

    setScannedItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: isNaN(q) ? 0 : q } : i))
    );
  };

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

  const handleStockItems = async () => {
    console.log("Stocking items...", scannedItems, receiptFile);
    if (scannedItems.length === 0) {
      console.log("No items scanned");
      toast.error("Please scan at least one item");
      return;
    }
    if (!receiptFile) {
      console.log("No receipt file uploaded");
      toast.error("Please upload a receipt");
      return;
    }

    const hasInvalidQty = scannedItems.some(
      (i) => !i.quantity || i.quantity < 1 || isNaN(i.quantity)
    );
    if (hasInvalidQty) {
      console.log("Invalid quantity detected in scanned items");
      toast.error("Invalid quantity detected.");
      return;
    }

    setLoading(true);

    try {
      const warehouseId = sessionStorage.getItem("selectedWarehouseId");

      if (!warehouseId) {
        console.log("Warehouse ID not found in sessionStorage");
        toast.error("Warehouse not selected");
        return;
      }

      // const firstLotNo = scannedItems[0]?.lotNo ?? "unknown-lot";
      // const sanitizedLotNo = firstLotNo.replace(/[^a-zA-Z0-9_-]/g, ""); // clean filename

      // const today = new Date();
      // const yyyy = today.getFullYear();
      // const mm = String(today.getMonth() + 1).padStart(2, "0");
      // const dd = String(today.getDate()).padStart(2, "0");
      // const formattedDate = `${yyyy}${mm}${dd}`;

      const fileExtension = receiptFile.name.split(".").pop(); // get original extension
      //
      const id = uuidv4();
      const fileName = `${id}.${fileExtension}`;

      // const fileName = `${sanitizedLotNo}-${formattedDate}.${fileExtension}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("xmon-storage")
        .upload(`receipts/${fileName}`, receiptFile);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        toast.error("Failed to upload receipt.");
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("xmon-storage")
        .getPublicUrl(`receipts/${fileName}`);

      if (!urlData?.publicUrl) {
        toast.error("Failed to get receipt URL.");
        setLoading(false);
        return;
      }

      const receiptUrl = urlData.publicUrl;
      setReceipt(receiptUrl);

      for (const item of scannedItems) {
        const res = await stockParts(
          item.lotNo,
          item.stockNo,
          item.productCode,
          item.description,
          item.quantity,
          warehouseId,
          receiptUrl
        );
        console.log("StockParts response:", res);
        if (res.error) {
          toast.error(res.error);
          continue;
        }
      }

      toast.success("Items stocked successfully");

      setScannedItems([]);
      setReceipt(null);
      setReceiptFile(null);
      sessionStorage.removeItem("receiptImage");
    } catch (err) {
      console.error(err);
      toast.error("Error stocking items");
    } finally {
      setLoading(false);
    }
  };

  return {
    scannedItems,
    setScannedItems,

    receipt,
    receiptFile,
    fileInputRef,

    scanning,
    loading,

    setScanning,
    handleScan,
    handleQuantityChange,
    handleUploadReceipt,
    handleUploadReceiptFile,
    handleStockItems,
  };
}
