"use client";

import Loader from "@/components/ui/loader";
import TransactionDesktop from "@/features/transactions/components/desktoptransactions";
import TransactionMobile from "@/features/transactions/components/mobiletransactions";
import { useIsMobile } from "@/hooks/useMobile";
import { useEffect, useState } from "react";

function Email() {
  const [loading, setLoading] = useState(true);
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

  return <>{isMobile ? <TransactionMobile /> : <TransactionDesktop />}</>;
}

export default Email;
