// src/features/admin/components/usersTab.tsx
"use client";
import React, { useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { AddUserForm } from "./add-user-form";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { useWarehouseHooks } from "../hooks/useWarehousesHooks";
import { AddUserForm } from "./add-user-form";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading: boolean;
  fetchUsersData: () => void;
}

export function UserTab<TData, TValue>({
  columns,
  data,
  loading,
  fetchUsersData,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const { warehouse } = useWarehouseHooks();
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [addUserOpen, setAddUserOpen] = React.useState(false);
  const t = useTranslations("Tabs");

  // useEffect(() => {
  //   const getWarehouses = async () => {
  //     const response = await fetch("/api/v2/warehouse");
  //     const wh = await response.json();
  //     console.log(wh);
  //     setWarehouses(wh);
  //   };
  //   getWarehouses();
  // }, []);

  const uniqueLocations = React.useMemo(() => {
    const locations = new Set<string>();
    warehouse?.forEach((item) => {
      if (item.warehouse) {
        locations.add(item.warehouse);
      }
    });
    return Array.from(locations);
  }, [warehouse]);

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
  });

  const handleLocationChange = (value: string) => {
    if (value === "all") {
      table.getColumn("warehouse")?.setFilterValue(undefined);
    } else {
      table.getColumn("warehouse")?.setFilterValue(value);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="mb-0 pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-primary">{t("userMgt")}</CardTitle>
            <Button
              onClick={() => setAddUserOpen(true)}
              className="flex items-center gap-2 hover:cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              {t("addUser")}
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
              <div className="w-full sm:w-[200px]">
                <Select onValueChange={handleLocationChange} defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allWh")}</SelectItem>
                    {uniqueLocations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <Table style={{ maxHeight: "100%" }}>
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
              {t("users2")}
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

      <AddUserForm
        open={addUserOpen}
        onOpenChange={setAddUserOpen}
        onUserAdded={fetchUsersData}
      />
    </>
  );
}
