// src/context/WarehouseContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getWarehouse } from "@/features/landing/services/getWarehouse";
import { Warehouse } from "@/types/warehouse";
import { useAuth } from "@/features/auth/hooks/auth-context";

type WarehouseContextType = {
  warehouses: Warehouse[];
  selectedWarehouse: Warehouse | null;
  warehouseId: string | null;
  location: string | null;
  loading: boolean;
  handleWarehouseChange: (id: string) => void;
};

export const WarehouseContext = createContext<WarehouseContextType | null>(
  null
);

export default function WarehouseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = useAuth();
  const isAdmin = session?.user?.role === "admin";
  const assignedWarehouseId = session?.user?.warehouse?.id ?? null;

  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(
    null
  );
  const getStoredWarehouseId = () => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem("warehouseId") ?? null;
  };

  const getStoredLocation = () => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem("warehouseLocation") ?? null;
  };

  const [warehouseId, setWarehouseId] = useState<string | null>(
    getStoredWarehouseId
  );
  const [location, setLocation] = useState<string | null>(getStoredLocation);
  const [loading, setLoading] = useState<boolean>(true);

  // Save warehouse selection persistently
  const persist = (id: string, loc: string | null) => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem("warehouseId", id);
    sessionStorage.setItem("warehouseLocation", loc ?? "");
  };

  useEffect(() => {
    if (session?.isAuthenticated) {
      fetchWarehouse();
    }
  }, [session?.isAuthenticated]);

  const fetchWarehouse = async () => {
    try {
      setLoading(true);
      let result: Warehouse[] = [];

      if (isAdmin) {
        result = await getWarehouse(null);
      } else {
        result = await getWarehouse(assignedWarehouseId);
      }

      setWarehouses(result);

      // Determine initial warehouse after refresh
      let initialWarehouse: Warehouse | undefined;

      if (warehouseId) {
        initialWarehouse = result.find((w) => w.id === warehouseId);
      }

      // If no persisted warehouse yet
      if (!initialWarehouse) {
        if (isAdmin) {
          initialWarehouse =
            result.find((w) => w.id === assignedWarehouseId) ?? result[0];
        } else {
          initialWarehouse = result[0];
        }
      }

      if (initialWarehouse) {
        setSelectedWarehouse(initialWarehouse);
        setWarehouseId(initialWarehouse.id);
        setLocation(initialWarehouse.location);
        persist(initialWarehouse.id, initialWarehouse.location);
      }
    } catch (err) {
      console.error("Warehouse fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleWarehouseChange = (id: string) => {
    const selected = warehouses.find((w) => w.id === id) ?? null;

    setSelectedWarehouse(selected);
    setWarehouseId(id);
    setLocation(selected?.location ?? null);

    persist(id, selected?.location ?? null);
  };

  return (
    <WarehouseContext.Provider
      value={{
        warehouses,
        selectedWarehouse,
        warehouseId,
        location,
        loading,
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
