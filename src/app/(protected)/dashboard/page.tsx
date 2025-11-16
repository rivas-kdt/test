"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSession } from "@/features/auth/hooks/sessionProvider";
// import { useAuth } from "@/features/auth/hooks/useAuth";
import { useTransaction } from "@/features/dashboard/hooks/useDashboardHooks";
import { useShip } from "@/features/dashboard/hooks/useShip";
import { useStock } from "@/features/dashboard/hooks/useStock";
import { useWarehouse } from "@/features/dashboard/hooks/useWarehouse";
import {
  Package,
  TrendingDown,
  TrendingUp,
  Truck,
  Warehouse,
  AlertCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  XAxis,
} from "recharts";

export default function Home() {
  const t = useTranslations("DashboardPage");
  const { user } = useSession();

  console.log(user);

  const {
    transactionLoading,
    monthly,
    totalLoading,
    total,
    totalError,
    totalPctChange,
  } = useTransaction();

  const {
    shippedThisMonth,
    shippedPercentageChange,
    shippedLoading,
    shippedError,
    recentShipped,
    recentShippedLoading,
    recentShippedError,
  } = useShip();

  const {
    stockedThisMonth,
    stockedPercentageChange,
    stockedLoading,
    stockedError,
    recentStocked,
    recentStockedLoading,
    recentStockedError,
  } = useStock();

  const { warehouseInventory, inventoryLoading, inventoryError } =
    useWarehouse();

  const chartConfig = {
    stocked: {
      label: "Stocked",
      color: "hsl(var(--chart-1))",
    },
    shipped: {
      label: "Shipped",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  console.log(total);

  return (
    <main className="space-y-2 flex flex-col p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        {/* Total Record */}
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">{t("totalRecorded")}</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            {totalLoading ? (
              <Skeleton className="h-[60px] w-full" />
            ) : totalError ? (
              <p className="text-destructive flex items-center gap-2">
                {/* TRANSLATEME Create translation for this */}
                <AlertCircle size={18} /> Failed to load total data
              </p>
            ) : (
              <>
                <div className="flex flex-col">
                  <p className="text-4xl font-bold">{total}</p>
                  {totalPctChange != null && (
                    <div className="flex gap-1 items-end">
                      {shippedPercentageChange > 0 ? (
                        <>
                          <TrendingUp className="text-green-500 h-5 w-5" />
                          <p className="text-base text-green-500">
                            {`${totalPctChange}%`}
                          </p>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="text-destructive h-5 w-5" />
                          <p className="text-md text-destructive">
                            {`${Math.abs(totalPctChange)}%`}
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
            <Warehouse className="h-12 w-12 text-primary" />
            {/* <div className="text-4xl font-bold">{total}</div> */}
            {/* <Warehouse className="h-12 w-12 text-primary" /> */}
          </CardContent>
        </Card>

        {/* Shipped Parts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">{t("shippedParts")}</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            {shippedLoading ? (
              <Skeleton className="h-[60px] w-full" />
            ) : shippedError ? (
              <p className="text-destructive flex items-center gap-2">
                {/* TRANSLATEME Create translation for this */}
                <AlertCircle size={18} /> Failed to load shipped data
              </p>
            ) : (
              <>
                <div className="flex flex-col">
                  <p className="text-4xl font-bold">{shippedThisMonth ?? 0}</p>
                  {shippedPercentageChange != null && (
                    <div className="flex gap-1 items-end">
                      {shippedPercentageChange > 0 ? (
                        <>
                          <TrendingUp className="text-green-500 h-5 w-5" />
                          <p className="text-base text-green-500">
                            {`${shippedPercentageChange}%`}
                          </p>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="text-destructive h-5 w-5" />
                          <p className="text-md text-destructive">
                            {`${Math.abs(shippedPercentageChange)}%`}
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
            <Truck className="h-12 w-12 text-primary" />
          </CardContent>
        </Card>

        {/* Stocked Parts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">{t("stockedParts")}</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            {stockedLoading ? (
              <Skeleton className="h-[60px] w-full" />
            ) : stockedError ? (
              <p className="text-destructive flex items-center gap-2">
                {/* TRANSLATEME Create translation for this */}
                <AlertCircle size={18} /> Failed to load stocked data
              </p>
            ) : (
              <>
                <div className="flex flex-col">
                  <p className="text-4xl font-bold">{stockedThisMonth ?? 0}</p>
                  {stockedPercentageChange != null && (
                    <div className="flex gap-1 items-end">
                      {stockedPercentageChange > 0 ? (
                        <>
                          <TrendingUp className="text-green-500 h-5 w-5" />
                          <p className="text-base text-green-500">
                            {`${stockedPercentageChange}%`}
                          </p>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="text-destructive h-5 w-5" />
                          <p className="text-md text-destructive">
                            {`${Math.abs(stockedPercentageChange)}%`}
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
            <Package className="h-12 w-12 text-primary" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-2">
        {/* Warehouse Transaction */}
        <Card className="col-span-3 flex flex-col">
          <CardHeader>
            <CardTitle className="text-primary">
              Warehouse Transaction
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            {inventoryLoading ? (
              <Skeleton className="h-[calc(40vh-80px)] w-full" />
            ) : inventoryError ? (
              <p className="text-destructive flex items-center gap-2">
                <AlertCircle size={18} /> Failed to load inventory data
              </p>
            ) : (
              <ChartContainer
                config={chartConfig}
                className="h-[calc(40vh-80px)] w-full"
              >
                <BarChart data={warehouseInventory}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="warehouse"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="stocked" radius={[0, 0, 4, 4]}>
                    {warehouseInventory.map((_, i) => (
                      <Cell key={i} fill={`var(--chart-${(i % 5) + 1})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Monthly Overview */}
        <Card className="col-span-3 flex flex-col">
          <CardHeader>
            <CardTitle className="text-primary">Monthly Overview</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            {transactionLoading ? (
              <Skeleton className="h-[calc(40vh-80px)] w-full" />
            ) : (
              <ChartContainer
                config={chartConfig}
                className="h-[calc(40vh-80px)] w-full"
              >
                <LineChart data={monthly} margin={{ left: 12, right: 12 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month_name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  <Line
                    dataKey="stocked"
                    type="monotone"
                    stroke="var(--color-chart-1)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    dataKey="shipped"
                    type="monotone"
                    stroke="var(--color-chart-2)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {/* Recent Stocked */}
        <Card className="h-full flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-primary">
                {t("recentStocked")}
              </CardTitle>
            </div>
            <CardDescription className="text-foreground">
              {t("desc1")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            {recentStockedLoading ? (
              <Skeleton className="h-[calc(19vh-80px)] w-full" />
            ) : recentStockedError ? (
              <p className="text-destructive flex items-center gap-2">
                {/* TRANSLATEME Create translation for this */}
                <AlertCircle size={18} /> Failed to load stocked list
              </p>
            ) : (
              <Table className="min-w-full table-auto">
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("lotNo")}</TableHead>
                    <TableHead>{t("prodCode")}</TableHead>
                    <TableHead>{t("stockNo")}</TableHead>
                    <TableHead>{t("quantity")}</TableHead>
                    <TableHead>{t("date")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentStocked?.map((item, key) => (
                    <TableRow key={key}>
                      <TableCell>{item.lot_no}</TableCell>
                      <TableCell className="font-medium">
                        {item.product_code}
                      </TableCell>
                      <TableCell>{item.stock_no}</TableCell>
                      <TableCell>{item.quantity ?? 0}</TableCell>
                      <TableCell>
                        {new Date(item.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Recent Shipped */}
        <Card className="h-full flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-primary">
                {t("recentShipped")}
              </CardTitle>
            </div>
            <CardDescription className="text-foreground">
              {t("desc2")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            {recentShippedLoading ? (
              <Skeleton className="h-[calc(19vh-80px)] w-full" />
            ) : recentShippedError ? (
              <p className="text-destructive flex items-center gap-2">
                {/* TRANSLATEME Create translation for this */}
                <AlertCircle size={18} /> Failed to load shipped list
              </p>
            ) : (
              <Table className="min-w-full table-auto">
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("lotNo")}</TableHead>
                    <TableHead>{t("prodCode")}</TableHead>
                    <TableHead>{t("stockNo")}</TableHead>
                    <TableHead>{t("quantity")}</TableHead>
                    <TableHead>{t("date")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentShipped?.map((item, key) => (
                    <TableRow key={key}>
                      <TableCell>{item.lot_no}</TableCell>
                      <TableCell className="font-medium">
                        {item.product_code}
                      </TableCell>
                      <TableCell>{item.stock_no}</TableCell>
                      <TableCell>{item.quantity ?? 0}</TableCell>
                      <TableCell>
                        {new Date(item.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
