import { useEffect, useState } from "react";
import { shipParts } from "../services/shipParts";
import { getStockedParts } from "../services/getStockedParts";
import { StockedPart, ShipHookConfig } from "@/types/ship";
import toast from "react-hot-toast";
import { useWarehouse } from "@/context/warehouseContext";

export function useShipHooks({
  t,
  setScanning,
  setHighlightedItem,
}: ShipHookConfig) {
  const [stockedParts, setStockedParts] = useState<StockedPart[]>([]);
  const [selectedItems, setSelectedItems] = useState<StockedPart[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { warehouseId } = useWarehouse();

  useEffect(() => {
    fetchStockedParts();
  }, []);

  // -------------------------
  // Fetch stocked items
  // -------------------------
  const fetchStockedParts = async () => {
    if (!warehouseId) return;

    setFetching(true);
    try {
      const items = await getStockedParts(warehouseId);

      setStockedParts(
        items.map((item) => ({
          ...item,
          selected: false,
          added: false,
          ship_quantity: 0,
        }))
      );
    } catch (err: any) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setFetching(false);
    }
  };

  // -------------------------
  // Select / Unselect item
  // -------------------------
  const toggleItemSelection = (item: StockedPart) => {
    setStockedParts((prev) =>
      prev.map((p) =>
        p.lot_no === item.lot_no ? { ...p, selected: !p.selected } : p
      )
    );
  };

  // -------------------------
  // Move to ship list
  // -------------------------
  const moveSelectedItems = () => {
    const selected = stockedParts.filter((i) => i.selected);

    if (!selected.length) return;

    setSelectedItems((prev) => [
      ...prev,
      ...selected.map((i) => ({ ...i, ship_quantity: 1 })),
    ]);

    setStockedParts((prev) => prev.filter((i) => !i.selected));

    setHighlightedItem(null);
  };

  // -------------------------
  // Remove from shipping list
  // -------------------------
  const removeFromShipping = (item: StockedPart) => {
    setSelectedItems((prev) => prev.filter((i) => i.lot_no !== item.lot_no));

    // return part back to stock list
    setStockedParts((prev) => [
      ...prev,
      { ...item, selected: false, ship_quantity: 0 },
    ]);
  };

  // -------------------------
  // Update quantity
  // -------------------------
  const handleInputChange = (value: string, index: number) => {
    const cleaned = value === "" ? "" : Number(value.replace(/^0+(?=\d)/, ""));

    setSelectedItems((prev) =>
      prev.map((p, i) => (i === index ? { ...p, ship_quantity: cleaned } : p))
    );
  };

  // -------------------------
  // QR Scan
  // -------------------------
  const handleScan = (data: string) => {
    if (!data) return;

    setScanning(false);

    const parts = data.split(",");
    if (parts.length < 6) {
      toast.error(t("invalidQR"));
      return;
    }

    const lot = parts[5];

    const matched = stockedParts.find((p) => p.lot_no === lot);

    if (!matched) {
      toast.error(t("noMatch"));
      return;
    }

    toggleItemSelection(matched);
    setHighlightedItem(lot);

    setSelectedItems((prev) =>
      prev.some((p) => p.lot_no === lot)
        ? prev
        : [...prev, { ...matched, ship_quantity: 1 }]
    );

    toast.success(t("foundAndAdded"));
  };

  // -------------------------
  // Ship parts (POST)
  // -------------------------
  const shipSelectedItems = async () => {
    setLoading(true);

    const failed: string[] = [];

    for (const item of selectedItems) {
      const qty = Number(item.ship_quantity);

      if (!qty || qty <= 0 || qty > item.quantity) {
        toast.error(t("invalidQuantity", { lotNo: item.lot_no }));
        failed.push(item.lot_no);
        continue;
      }

      try {
        await shipParts(item.lot_no, qty);
      } catch (err: any) {
        toast.error(err.message);
        failed.push(item.lot_no);
      }
    }

    if (failed.length === selectedItems.length) {
      toast.error(t("failedToShipParts"));
      return;
    }

    toast.success(t("shipSuccess"));

    setSelectedItems([]);
    await fetchStockedParts();
    setLoading(false);
  };

  return {
    stockedParts,
    selectedItems,
    fetching,
    loading,
    error,
    toggleItemSelection,
    moveSelectedItems,
    removeFromShipping,
    handleInputChange,
    handleScan,
    shipParts: shipSelectedItems,
    fetchStockedParts,
  };
}
