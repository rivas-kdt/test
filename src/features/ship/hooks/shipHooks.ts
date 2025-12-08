/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { shipParts } from "../services/shipParts";
import { getStockedParts } from "../services/getStockedParts";
import toast from "react-hot-toast";
import { useWarehouse } from "@/context/warehouseContext";

export function useShipHooks({
  t,
  setScanning,
  setHighlightedItem,
}: {
  t: any;
  setScanning: any;
  setHighlightedItem: any;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [stockedParts, setStockedParts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  const { warehouseId } = useWarehouse();

  useEffect(() => {
    fetchStockedParts();
  }, []);

  const handleShipPart = async (selected: any[]) => {
    setLoading(true);
    try {
      const responses: any[] = [];
      const failed: string[] = [];

      for (const item of selected) {
        const shipQty = Number(item.ship_quantity);

        // Validate before API call
        if (!shipQty || shipQty <= 0) {
          toast.error(t("invalidQuantity", { lotNo: item.lot_no }), {
            duration: 4000,
          });
          failed.push(item.lot_no);
          continue; // skip this item
        }

        if (shipQty > item.quantity) {
          toast.error(t("invalidStock", { lotNo: item.lot_no }), {
            duration: 4000,
          });
          failed.push(item.lot_no);
          continue; // skip this item
        }

        try {
          // Ship valid item
          const response = await shipParts(item.lot_no, shipQty);
          responses.push(response);
        } catch (err: any) {
          console.error("Error shipping item:", err);
          toast.error(err?.message || t("failedToShipParts"));
          failed.push(item.lot_no);
          continue; // skip this failed item
        }
      }

      // If only one item was selected and it failed → stop
      if (selected.length === 1 && failed.length === 1) {
        setError(t("failedToShipParts"));
        return;
      }

      // Remove successfully shipped items from selected list
      const succeededLotNos = selected
        .filter((s) => !failed.includes(s.lot_no))
        .map((s) => s.lot_no);

      // Update stockedParts (unselect + reset + adjust quantity)
      setStockedParts((prev) =>
        prev
          .map((i) => {
            if (succeededLotNos.includes(i.lot_no)) {
              const shippedItem = selected.find((s) => s.lot_no === i.lot_no);
              const newQty =
                i.quantity - Number(shippedItem?.ship_quantity || 0);
              return {
                ...i,
                quantity: Math.max(newQty, 0),
                selected: false,
                added: false,
                ship_quantity: 0,
              };
            }
            return i;
          })
          // Optional: if quantity is 0, remove it entirely
          .filter((i) => i.quantity > 0)
      );

      setSelectedItems((prev) =>
        prev.filter((item) => !succeededLotNos.includes(item.lot_no))
      );

      // Refetch latest stocked parts (to ensure sync with DB)
      await fetchStockedParts();

      //show success toast only if at least one succeeded
      if (responses.length > 0) {
        toast.success(
          responses.length === selected.length
            ? t("allItemsShipped")
            : t("someItemsShipped", { count: responses.length })
        );
        setMessage(t("allItemsShipped"));
      }

      return responses;
    } catch (error: any) {
      console.error("Error in shipping part:", error);
      setError(error.message || t("failedToShipParts"));
      toast.error(error.message || t("failedToShipParts"));
    } finally {
      setLoading(false);
    }
  };

  const fetchStockedParts = async () => {
    setFetching(true);

    try {
      if (!warehouseId) {
        toast.error(t("noWarehouseID"));
        throw new Error("Warehouse ID not found in session storage");
      }

      const response = await getStockedParts(warehouseId);

      setFetching(false);

      if (!response || response.length === 0) {
        toast.error(t("noStockedForWarehouse"), { id: "no-stocked" });
        throw new Error("No stocked parts found for the given warehouse");
      }

      const formattedResponse = response.map((part: any) => ({
        ...part,
        selected: false,
        added: false,
        ship_quantity: 0,
      }));

      setStockedParts(formattedResponse);
    } catch (error: any) {
      setFetching(false);

      toast.error(error.message || t("failedFetchForWarehouse"));
      setError(error.message || "Failed to fetch stocked parts");
    }
  };

  const toggleItemSelection = (item: any) => {
    setStockedParts((prev) =>
      prev.map((i) =>
        i.lot_no === item.lot_no ? { ...i, selected: !i.selected } : i
      )
    );
  };

  // const toggleItemAdded = (item: any) => {
  //   const selected = item.filter((i: any) => i.selected === true);
  //   setStockedParts((prev) =>
  //     prev.map((i) =>
  //       selected.some((s: any) => s.lot_no === i.lot_no)
  //         ? { ...i, added: !i.added }
  //         : i
  //     )
  //   );
  // };

  const handleScan = (data: any) => {
    if (!data) return;
    setScanning(false);

    try {
      const values = data.split(",");
      if (values.length < 6) {
        toast.error(t("invalidQR"));
        return;
      }
      const scannedLotNo = values[5];

      setStockedParts((prevStockedItems: any) => {
        const index = prevStockedItems.findIndex(
          (item: any) => item.lot_no === scannedLotNo
        );
        if (index !== -1) {
          const updatedStockedItems = [...prevStockedItems];
          const matchedItem = updatedStockedItems[index];
          updatedStockedItems[index] = { ...matchedItem, selected: true };
          setHighlightedItem(matchedItem.lot_no);
          console.log(matchedItem);
          toast.success(t("foundAndAdded"));

          setSelectedItems((prevSelected: any) => {
            const alreadyAdded = prevSelected.some(
              (item: any) => item.lot_no === matchedItem.lot_no
            );
            if (alreadyAdded) return prevSelected;
            return [...prevSelected, { ...matchedItem, ship_quantity: 1 }];
          });

          return updatedStockedItems;
        } else {
          toast.error(t("noMatch"));
          return prevStockedItems;
        }
      });
    } catch (error) {
      console.error("Error processing QR code:", error);
      toast.error(t("scanError"));
    }
  };

  const moveSelectedItems = (stockedItems: any, setHighlightedItem: any) => {
    const itemsToMove = stockedItems.filter((item: any) => item.selected);
    if (itemsToMove.length === 0) {
      return;
    }
    setSelectedItems((prev: any) => [...prev, ...itemsToMove]);
    setStockedParts((prev: any) => prev.filter((item: any) => !item.selected));
    setHighlightedItem(null);
  };

  const removeFromShipping = (item: any) => {
    setSelectedItems((prev: any) =>
      prev.filter((i: any) => i.lot_no !== item.lot_no)
    );
    setStockedParts((prev: any) => [...prev, { ...item, selected: false }]);
  };

  const handleInputChange = (e: any, index: any) => {
    let inputValue = e.target.value;
    if (inputValue === "") {
      setSelectedItems((prevItems: any) =>
        prevItems.map((item: any, i: any) =>
          i === index ? { ...item, ship_quantity: "" } : item
        )
      );
      return;
    }
    inputValue = inputValue.replace(/^0+(?=\d)/, "");
    const value = Number(inputValue);
    setSelectedItems((prevItems: any) =>
      prevItems.map((item: any, i: any) =>
        i === index ? { ...item, ship_quantity: value } : item
      )
    );
  };

  return {
    message,
    error,
    loading,
    stockedParts,
    toggleItemSelection,
    // toggleItemAdded,
    shipParts: handleShipPart,
    fetchStockedParts,
    fetching,
    handleScan,
    moveSelectedItems,
    removeFromShipping,
    handleInputChange,
    selectedItems,
  };
}
