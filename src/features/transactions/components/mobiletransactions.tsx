"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTransactionHooks } from "../hooks/useTransactions";
import { useWarehouse } from "@/context/warehouseContext";
import { Transaction } from "@/types/transaction";

const TransactionMobile = () => {
  const router = useRouter();
  const t = useTranslations("transaction-page");
  const { warehouseId } = useWarehouse();
  const { transactions, loading } = useTransactionHooks();

  const [selectedTab, setSelectedTab] = useState<"Shipped" | "Stocked">(
    "Shipped"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isInputVisible, setIsInputVisible] = useState(false);

  const filtered = transactions
    .filter((tx) => tx.status.toLowerCase() === selectedTab.toLowerCase())
    .filter((tx) => tx.lot_no.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((tx) =>
      warehouseId ? tx.warehouse_id.includes(warehouseId) : true
    );

  return (
    <main className="fixed flex flex-col w-screen p-4 pt-2 overflow-y-auto bg-linear-to-b from-primary/10 to-background">
      <Button variant="ghost" size="icon" onClick={() => router.back()}>
        <ArrowLeft className="h-6 w-6" />
      </Button>

      <h1 className="text-xl font-bold ml-2">{t("title")}</h1>

      {/* Tabs */}
      <div className="flex justify-between items-center mt-2 mb-4">
        <div className="flex space-x-2">
          <Button
            variant={selectedTab === "Shipped" ? "default" : "outline"}
            onClick={() => setSelectedTab("Shipped")}
          >
            {t("ship-tab")}
          </Button>
          <Button
            variant={selectedTab === "Stocked" ? "default" : "outline"}
            onClick={() => setSelectedTab("Stocked")}
          >
            {t("stock-tab")}
          </Button>
        </div>

        <Button
          onClick={() => setIsInputVisible((p) => !p)}
          className="rounded-full"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>

      {isInputVisible && (
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("searchby")}
          className="mb-4"
        />
      )}

      <div className="px-2 overflow-y-auto max-h-[75vh]">
        {loading ? (
          <p className="text-center">{t("loading-page")}</p>
        ) : filtered.length === 0 ? (
          <p className="text-center">{t("no-transactions")}</p>
        ) : (
          filtered.map((item: Transaction) => (
            <div
              key={item.id}
              className="border border-primary rounded-lg p-2 my-4 bg-card shadow-sm"
            >
              <div className="flex justify-between mb-2">
                <span className="font-medium text-primary">
                  {item.warehouse}
                </span>
                <span>
                  {t("date")}:{" "}
                  {new Date(item.created_at ?? item.date!).toLocaleDateString()}
                </span>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("lotNo")}</TableHead>
                    <TableHead>{t("quantity")}</TableHead>
                    <TableHead>{t("status")}</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  <TableRow>
                    <TableCell>{item.lot_no}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.status}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ))
        )}
      </div>
    </main>
  );
};

export default TransactionMobile;
