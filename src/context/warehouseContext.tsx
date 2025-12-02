"use client";

import { useAuth } from "@/features/auth/hooks/auth-context";
import { getWarehouse } from "@/features/landing/services/getWarehouse";
import { createContext, useContext, useEffect, useState } from "react";

type WarehouseContextType = {
  warehouses: any[];
  selectedWarehouse: any | null;
  warehouseId: string | null;
  location: string | null;
  loading: boolean;
  setWarehouseId: (id: string | null) => void;
  handleWarehouseChange: (warehouseId: string) => void;
};

export const WarehouseContext = createContext<WarehouseContextType | null>(
  null
);

export default function WarehouseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<any>(null);
  const [warehouseId, setWarehouseId] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { session } = useAuth();
  const selectedWarehouseId = session?.user?.warehouse?.id ?? null;

  useEffect(() => {
    if (session?.isAuthenticated) {
      fetchWarehouse();
    }
  }, [session?.isAuthenticated]);

  const fetchWarehouse = async () => {
    try {
      setLoading(true);

      let response: any[] = [];

      if (session?.user?.role === "admin") {
        // admin: load all warehouses
        response = await getWarehouse(null);
      } else if (session?.user) {
        // non-admin: load only assigned warehouse
        response = await getWarehouse(selectedWarehouseId);
      }

      setWarehouses(response || []);

      if (response && response.length > 0) {
        const initial = response[0];

        if (session?.user?.role !== "admin" && selectedWarehouseId) {
          setWarehouseId(String(selectedWarehouseId));
          setLocation(initial.location ?? null);
        } else {
          setWarehouseId(String(initial.id));
          setLocation(initial.location ?? null);
        }
      }
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWarehouseChange = (id: string) => {
    setWarehouseId(id);
    const selected = warehouses.find((w: any) => String(w.id) === id);
    setSelectedWarehouse(selected ?? null);
    setLocation(selected?.location ?? null);
  };

  return (
    <WarehouseContext.Provider
      value={{
        warehouses,
        selectedWarehouse,
        warehouseId,
        location,
        loading,
        setWarehouseId,
        handleWarehouseChange,
      }}
    >
      {children}
    </WarehouseContext.Provider>
  );
}

export function useWarehouse() {
  const ctx = useContext(WarehouseContext);
  if (!ctx) {
    throw new Error("useWarehouse must be used within a WarehouseProvider");
  }
  return ctx;
}
