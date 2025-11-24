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
import { useIsMobile } from "@/hooks/useMobile";
import { ArrowLeft, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Transaction = {
  id: string;
  lot_no: string;
  quantity: number;
  warehouse: string;
  status: "Shipped" | "Stocked" | string;
  created_at: string;
};

type Warehouse = {
  id: string;
  name: string;
  location?: string;
  warehouse?: string;
};

const TransactionMobile = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(
    null
  );
  const [selectedTab, setSelectedTab] = useState<"Shipped" | "Stocked">(
    "Shipped"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isInputVisible, setIsInputVisible] = useState(false);
  const t = useTranslations("transaction-page");

  const handleSearchClick = () => setIsInputVisible((prev) => !prev);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  const filteredTransactions = transactions
    .filter((item) => item.status.toLowerCase() === selectedTab.toLowerCase())
    .filter((item) =>
      item.lot_no.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="fixed flex flex-col w-screen min-h-screen p-4 pt-20 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-y-auto">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.back()}
        className="active:bg-primary transition"
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>

      {/* Header */}
      <div className="mb-2">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold ml-2">{t("title")}</h1>
        </div>
      </div>

      {/* Tabs and Search */}
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
        <Button onClick={handleSearchClick} className="rounded-full">
          <Search className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </div>

      {/* Search Input */}
      {isInputVisible && (
        <Input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          className="mb-4 mt-2 p-2 border border-gray-300 rounded-lg shadow-sm w-full"
          placeholder={t("searchby")}
        />
      )}

      {/* Transactions List */}
      <div className="px-2 overflow-y-auto max-h-[75vh]">
        {loading ? (
          <p className="text-center text-sm text-muted-foreground">
            {t("loading-page")}
          </p>
        ) : !selectedWarehouse ? (
          <p className="text-center text-sm text-muted-foreground">
            {t("select-wh")}.
          </p>
        ) : (
          <>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((item) => (
                <div
                  key={item.id}
                  className="border border-primary rounded-lg p-2 my-4 bg-white dark:bg-gray-800 shadow-sm"
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-primary">
                      {t("warehouse")}: {item.warehouse || t("no-warehouse")}
                    </span>
                    <span>
                      {t("date")}:{" "}
                      {new Date(item.created_at).toLocaleDateString()}
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
                        <TableCell>
                          {item.status.toLowerCase() === "shipped"
                            ? "Shipped"
                            : item.status.toLowerCase() === "stocked"
                            ? "Stocked"
                            : item.status}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground mt-4">
                {t("no-transactions")}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionMobile;
