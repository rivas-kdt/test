/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { getRecipients } from "../services/getRecipients";
import { addRecipient } from "../services/addRecipient";
import { updateRecipientStatus } from "../services/updateRecipient";

export function useRecipientHooks() {
  const [recipients, setRecipients] = useState<any[]>([]);
  const [recipientLoading, setRecipientLoading] = useState(true);
  const [recipientError, setRecipientError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecipients();
  }, []);

  const fetchRecipients = async () => {
    setRecipientLoading(true);
    try {
      const response = await getRecipients();
      setRecipients(response);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      setRecipientError(error.message || "Failed to fetch stocked data");
    } finally {
      setRecipientLoading(false);
    }
  };

  const handleAddRecipient = async (email: any) => {
    try {
      const response = await addRecipient(email);
      if (response.success) {
        await fetchRecipients();
      } else {
        throw new Error(response.message || "Failed to add recipient");
      }
    } catch (error: any) {
      console.error("Error adding recipient:", error);
      setRecipientError(error.message || "Failed to add recipient");
    }
  };

  const handleActiveChange = async (id: string, isActive: boolean) => {
    try {
      console.log("id, isActive: ", id, isActive);
      const response = await updateRecipientStatus(id, isActive);
      if (response.success) {
        await fetchRecipients();
      } else {
        throw new Error(
          response.message || "Failed to update recipient status"
        );
      }
    } catch (error) {
      console.error("Error updating recipient status:", error);
    }
  };

  return {
    recipients,
    recipientLoading,
    recipientError,
    addRecipient: handleAddRecipient,
    refetchRecipient: fetchRecipients,
    handleActiveChange,
  };
}
