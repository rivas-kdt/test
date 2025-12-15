"use client";

import React, { useState } from "react";
import { ArrowUpDown, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { TransactionTable } from "./ui/transactionstab";
import Loader from "@/components/ui/loader";
import { Transaction } from "@/types/transaction";
import { useTransactionHooks } from "../hooks/useTransactions";
import { ImagePreviewDialog } from "./ui/image-preview-dialog";

const TransactionDesktop = () => {
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const { transactions, loading } = useTransactionHooks();
  const t = useTranslations("Table");

  // ==========================
  // Column Definitions
  // ==========================

  const columns: ColumnDef<Transaction>[] = [
    { accessorKey: "lot_no", header: t("lotNo") },
    { accessorKey: "stock_no", header: t("stockNo") },
    { accessorKey: "description", header: t("description") },
    { accessorKey: "warehouse", header: t("warehouse") },

    {
      accessorKey: "quantity",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          {t("quantity")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },

    {
      accessorKey: "status",
      header: t("status"),
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <p>
            {status ? status.charAt(0).toUpperCase() + status.slice(1) : "-"}
          </p>
        );
      },
    },

    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          {t("date")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const d = row.original.created_at;
        return <p>{d ? new Date(d).toLocaleDateString() : "-"}</p>;
      },
    },

    {
      accessorKey: "imgUrl",
      header: t("image"),
      cell: ({ row }) => {
        const img = row.original.imgUrl;
        if (!img) return null;

        return (
          <Button
            size="icon"
            variant="outline"
            onClick={() => setImgPreview(img)}
          >
            <EyeIcon className="h-5 w-5" />
          </Button>
        );
      },
    },
  ];

  if (loading) return <Loader />;

  return (
    <main className="p-4 flex flex-col bg-linear-to-b from-primary/10 to-background">
      <TransactionTable
        columns={columns}
        data={transactions}
        loading={loading}
      />

      <ImagePreviewDialog
        open={!!imgPreview}
        imgUrl={imgPreview}
        onClose={() => setImgPreview(null)}
      />
    </main>
  );
};

export default TransactionDesktop;
