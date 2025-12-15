"use client";

import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { ProtectedRoute } from "@/features/auth/components/protected-route";
import { InventoryTable } from "@/features/inventory/components/page";
import { useInventory } from "@/features/inventory/hooks/useInventory";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { InventoryRow } from "@/types/inventory";

export default function InventoryPage() {
  const t = useTranslations("Table");
  const { inventory, inventoryLoading, warehouse } = useInventory();

  const columns: ColumnDef<InventoryRow>[] = [
    { accessorKey: "lot_no", header: t("lotNo") },
    { accessorKey: "product_code", header: t("prodCode") },
    { accessorKey: "stock_no", header: t("stockNo") },
    { accessorKey: "description", header: t("description") },
    { accessorKey: "warehouse", header: t("warehouse") },

    {
      accessorKey: "quantity",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("quantity")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },

    {
      accessorKey: "created_at",
      header: t("date"),
      cell: ({ row }) => {
        const date = new Date(row.original.created_at).toLocaleDateString();
        return <span>{date}</span>;
      },
    },
  ];

  if (inventoryLoading) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="p-4 gap-2 bg-linear-to-b from-primary/10 to-background">
        <InventoryTable
          columns={columns}
          data={inventory}
          loading={inventoryLoading}
          warehouse={warehouse}
        />
      </main>
    </ProtectedRoute>
  );
}
