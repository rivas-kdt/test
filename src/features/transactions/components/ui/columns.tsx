"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export type Transaction = {
  lot_no: string;
  quantity: number;
  warehouse: string;
  status: string;
  created_at: string;
} | null;

export const InventoryColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "lot_no",
    header: "Lot No.",
  },
  {
    accessorKey: "warehouse",
    header: "Warehouse",
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const part = row.original;
      const status = (part && part.status) || "null";
      return <p>{`${status[0].toUpperCase()}${status?.slice(1)}`}</p>;
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const parts = row.original;
      const date2 =
        parts && parts.created_at
          ? new Date(parts.created_at).toLocaleDateString()
          : "-";
      return <p>{date2}</p>;
    },
  },
];
