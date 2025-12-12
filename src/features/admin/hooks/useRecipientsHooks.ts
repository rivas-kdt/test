import { useState, useEffect } from "react";
import { getRecipients } from "../services/getRecipients";
import { updateRecipientStatus } from "../services/updateRecipient";
import { Recipient } from "@/types/admin";

export function useRecipientHooks() {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [recipientLoading, setRecipientLoading] = useState(true);
  const [recipientError, setRecipientError] = useState<string | null>(null);

  const fetchRecipients = async () => {
    setRecipientLoading(true);
    try {
      const data = await getRecipients();
      setRecipients(data);
    } catch (err: any) {
      setRecipientError(err.message);
    } finally {
      setRecipientLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipients();
  }, []);

  const handleActiveChange = async (id: string, isActive: boolean) => {
    // 🔥 OPTIMISTIC UPDATE
    setRecipients((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isactive: isActive } : r))
    );

    const result = await updateRecipientStatus(id, isActive);

    if (!result.success) {
      // ❌ Revert UI if failed
      setRecipients((prev) =>
        prev.map((r) => (r.id === id ? { ...r, isactive: !isActive } : r))
      );
      console.error(result.message);
    }
  };

  return {
    recipients,
    recipientLoading,
    recipientError,
    handleActiveChange,
    refetchRecipients: fetchRecipients,
  };
}
