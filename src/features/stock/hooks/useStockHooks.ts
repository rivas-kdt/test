import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { stockParts } from "../services/StockParts";

export function useStockActions() {
  const [scannedItems, setScannedItems] = useState<any[]>([]);
  const [receipt, setReceipt] = useState<string | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStockItems = async (
    lotNo: any,
    stockNo: any,
    productCode: any,
    descrption: any,
    quantity: any
  ) => {
    // if (scannedItems.length === 0) {
    //   toast.error("Please scan at least one item", { duration: 4000 });
    //   return;
    // }

    // if (!receiptFile) {
    //   toast.error("Please select a receipt to upload", { duration: 4000 });
    //   return;
    // }

    // if (!selectedWarehouse) {
    //   toast.error("Please select a warehouse", { duration: 4000 });
    //   return;
    // }

    // // Check for invalid quantities
    // const hasInvalidQuantity = scannedItems.some(
    //   (item) => item.quantity < 1 || isNaN(item.quantity)
    // );
    // if (hasInvalidQuantity) {
    //   toast.error("Quantity must have a value of at least 1", {
    //     duration: 4000,
    //   });
    //   return;
    // }

    setLoading(true);

    try {
      // Upload receipt to Supabase
      // Makes filename = lotNo-CurrentDate
      //   const firstLotNo = scannedItems[0]?.lotNo ?? "unknown-lot";
      //   const sanitizedLotNo = firstLotNo.replace(/[^a-zA-Z0-9_-]/g, ""); // clean filename

      //   const today = new Date();
      //   const yyyy = today.getFullYear();
      //   const mm = String(today.getMonth() + 1).padStart(2, "0");
      //   const dd = String(today.getDate()).padStart(2, "0");
      //   const formattedDate = `${yyyy}${mm}${dd}`;

      //   const fileExtension = receiptFile.name.split(".").pop(); // get original extension
      //   //
      //   const id = uuidv4();
      //   const fileName = `${id}.${fileExtension}`;
      //   const { data: uploadData, error: uploadError } = await supabase.storage
      //     .from("xmon-storage")
      //     .upload(`receipts/${fileName}`, receiptFile);

      //   if (uploadError) {
      //     console.error("Upload error:", uploadError);
      //     toast.error("Failed to upload receipt.");
      //     setLoading(false);
      //     return;
      //   }

      //   // Get public URL
      //   const { data: urlData } = supabase.storage
      //     .from("xmon-storage")
      //     .getPublicUrl(`receipts/${fileName}`);

      //   if (!urlData?.publicUrl) {
      //     toast.error("Failed to get receipt URL.");
      //     setLoading(false);
      //     return;
      //   }

      //   const receiptUrl = urlData.publicUrl;
      //   setReceipt(receiptUrl);

      const seleWarehouse = sessionStorage.getItem("warehouseId");

      //   for (const item of scannedItems) {
      const res = await stockParts(
        lotNo,
        stockNo,
        productCode,
        descrption,
        quantity,
        seleWarehouse
      );
      // const response = await fetch("/api/stock", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     product_code: item.productCode,
      //     stock_no: item.stockNo,
      //     lot_no: item.lotNo,
      //     description: item.description,
      //     quantity: item.quantity,
      //     warehouse_id: seleWarehouse,
      //     receipt_url: receiptUrl,
      //   }),
      // });

      // const { error } = await response.json();

      // if (error) {
      //   console.error("Error inserting into parts table:", error);
      //   toast.error("Database error", { duration: 4000 });
      // }
      //   }

      toast.success(res.message, { duration: 4000 });

      return res;
      //   setScannedItems([]);
      //   setReceipt(null);
      //   setReceiptFile(null);
    } catch (error) {
      console.error("Error stocking items:", error);
      toast.error("Error", { duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  return {
    handleStockItems,
    scanning,
    setScanning,
    receipt,
    setReceipt,
    receiptFile,
    setReceiptFile,
    fileInputRef,
    scannedItems,
    setScannedItems,
    loading,
  };
}
