"use client";

import Loader from "@/components/ui/loader";
import WarehouseProvider, { useWarehouse } from "@/context/warehouseContext";
import TransactionDesktop from "@/features/transactions/components/desktoptransactions";
import TransactionMobile from "@/features/transactions/components/mobiletransactions";
import { useIsMobile } from "@/hooks/useMobile";
import { useEffect, useState } from "react";

function Email() {
  const [loading, setLoading] = useState(true);
  const { warehouseId } = useWarehouse();
  console.log("Warehouse ID in Transactions Page:", warehouseId);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile !== undefined) {
      setLoading(false);
    }
  }, [isMobile]);

  if (loading) {
    <Loader />;
  }

  return (
    <>
      {isMobile ? (
        <WarehouseProvider>
          <TransactionMobile />
        </WarehouseProvider>
      ) : (
        <TransactionDesktop />
      )}
    </>
  );
}

export default Email;
