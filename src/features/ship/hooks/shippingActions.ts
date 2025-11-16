import { useState } from "react";
import toast from "react-hot-toast";

export function useShippingActions({
  t,
  setScanning,
  setHighlightedItem,
}: {
  t: any;
  setScanning: any;
  setHighlightedItem: any;
  fetchStockedParts: any;
}) {
  const [loading, setLoading] = useState(false);

  const handleScan = (
    data: any,
    setStockedItems: any,
    setSelectedItems: any
  ) => {
    if (!data) return;
    setScanning(false);

    try {
      const values = data.split(",");
      if (values.length < 6) {
        toast.error("Invalid QR code format");
        return;
      }
      const scannedLotNo = values[5];

      setStockedItems((prevStockedItems: any) => {
        const index = prevStockedItems.findIndex(
          (item: any) => item.lot_no === scannedLotNo
        );
        if (index !== -1) {
          const updatedStockedItems = [...prevStockedItems];
          const matchedItem = updatedStockedItems[index];
          updatedStockedItems[index] = { ...matchedItem, selected: true };
          setHighlightedItem(matchedItem.lot_no);

          setSelectedItems((prevSelected: any) => {
            const alreadyAdded = prevSelected.some(
              (item: any) => item.lot_no === matchedItem.lot_no
            );
            if (alreadyAdded) return prevSelected;
            return [...prevSelected, { ...matchedItem, ship_quantity: 1 }];
          });

          return updatedStockedItems;
        } else {
          return prevStockedItems;
        }
      });
    } catch (error) {
      console.error("Error processing QR code:", error);
      toast.error("Failed to process the scanned QR code");
    }
  };

  const moveSelectedItems = (
    stockedItems: any,
    setStockedItems: any,
    setSelectedItems: any,
    setHighlightedItem: any
  ) => {
    const itemsToMove = stockedItems.filter((item: any) => item.selected);
    if (itemsToMove.length === 0) {
      return;
    }
    setSelectedItems((prev: any) => [...prev, ...itemsToMove]);
    setStockedItems((prev: any) => prev.filter((item: any) => !item.selected));
    setHighlightedItem(null);
  };

  const removeFromShipping = (
    item: any,
    setSelectedItems: any,
    setStockedItems: any
  ) => {
    setSelectedItems((prev: any) =>
      prev.filter((i: any) => i.lot_no !== item.lot_no)
    );
    setStockedItems((prev: any) => [...prev, { ...item, selected: false }]);
  };

  const handleInputChange = (e: any, index: any, setSelectedItems: any) => {
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
    loading,
    handleScan,
    moveSelectedItems,
    removeFromShipping,
    handleInputChange,
  };
}
