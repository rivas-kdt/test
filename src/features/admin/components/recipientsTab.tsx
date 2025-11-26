"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  getFilteredRowModel,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Mail, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { AddRecipientForm } from "./add-recipient-form";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { AddRecipientForm } from "./add-recipient-form";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading: boolean;
  onActiveChange: (id: string, active: boolean) => Promise<void>;
}

export function RecipientsTab<TData, TValue>({
  columns,
  data,
  loading,
  onActiveChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [addRecipientOpen, setAddRecipientOpen] = React.useState(false);
  const t = useTranslations("Tabs");

  // const onActiveChange = async (id: string, active: boolean) => {
  //   const payload = {
  //     id: id,
  //     isActive: active,
  //   };
  //   console.log("nag run sya");
  //   await fetch("/api/v2/recipients", {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(payload),
  //   });
  //   console.log(payload);
  // };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    meta: {
      onActiveChange,
    },
  });

  return (
    <>
      <Card>
        <CardHeader className="mb-0 pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-primary">{t("recipientMgt")}</CardTitle>
            <Button
              onClick={() => setAddRecipientOpen(true)}
              variant="outline"
              className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/50"
            >
              <Mail className="h-4 w-4" />
              {t("addRec")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-2">
            <div className="flex-1 flex gap-4">
              <div className="relative w-[400px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("input")}
                  value={globalFilter ?? ""}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
          <div>
            {loading ? (
              <>
                <Skeleton className=" h-[50px] w-full mb-2" />
                <Skeleton className=" h-[250px] w-full" />
              </>
            ) : (
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((hg) => (
                    <TableRow key={hg.id}>
                      {hg.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="px-2">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        {t("noResults")}.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <div className=" w-full flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getPaginationRowModel().rows.length} of {data.length}{" "}
              {t("recipients")}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {t("prev")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {t("next")}
            </Button>
          </div>
        </CardFooter>
      </Card>

      <AddRecipientForm
        open={addRecipientOpen}
        onOpenChange={setAddRecipientOpen}
      />
    </>
  );
}
