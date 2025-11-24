import React, { useEffect, useState } from "react";
import { ArrowUpDown, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { TransactionTable } from "./ui/transactionstab";
import { Imagedialog } from "./ui/imgDialog";

export type Transaction = {
  lot_no: string;
  stock_no: string;
  description: string;
  quantity: number;
  warehouse: string;
  status: string;
  date: string;
  imgUrl: string;
} | null;

const TransactionDesktop = () => {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [imgOpen, setImgOpen] = useState(false);
  const [selectedImgUrl, setSelectedImgUrl] = useState<string>();
  const t = useTranslations("Table");

  useEffect(() => {
    setLoading(true);
    const fetchParts = async () => {
      const response = await fetch("/api/v2/inventory/test");
      const data2 = await response.json();
      setData(data2);
      setLoading(false);
    };
    fetchParts();
  }, []);
  console.log(data);
  const InventoryColumns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "lot_no",
      header: t("lotNo"),
    },
    {
      accessorKey: "stock_no",
      header: t("stockNo"),
    },
    {
      accessorKey: "description",
      header: t("description"),
    },
    {
      accessorKey: "warehouse",
      header: t("warehouse"),
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("quantity")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "status",
      header: t("status"),
      cell: ({ row }) => {
        const part = row.original;
        const status = (part && part.status) || "null";
        return <p>{`${status[0].toUpperCase()}${status?.slice(1)}`}</p>;
      },
    },
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("date")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const parts = row.original;
        const date2 =
          parts && parts.date ? new Date(parts.date).toLocaleDateString() : "-";
        return <p>{date2}</p>;
      },
    },
    {
      accessorKey: "imgUrl",
      header: t("image"),
      cell: ({ row }) => {
        const parts = row.original;
        if (parts?.imgUrl === null) {
          return <></>;
        }
        return (
          <Button
            onClick={() => {
              console.log(parts?.imgUrl);
              setSelectedImgUrl(parts?.imgUrl);
              setImgOpen(true);
            }}
          >
            <EyeIcon />
          </Button>
        );
      },
    },
  ];

  return (
    <main className="p-4 flex flex-col bg-gradient-to-b from-primary/10 to-background">
      <div className="  h-full w-full flex items-center">
        <TransactionTable
          columns={InventoryColumns}
          data={data}
          loading={loading}
        />
      </div>
      <Imagedialog
        open={imgOpen}
        onOpenChange={setImgOpen}
        img={selectedImgUrl}
      />
    </main>
  );
};

export default TransactionDesktop;
