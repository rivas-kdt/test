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
import { ProtectedRoute } from "@/features/auth/components/protected-route";
import { useAuth } from "@/features/auth/hooks/auth-context";
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
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

interface MonthlyData {
  month_name: string;
  stocked: number;
  shipped: number;
}

const DashboardContent = () => {
  const t = useTranslations("DashboardPage");

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

  const maxStocked = Math.max(
    ...(monthly?.map((d: MonthlyData) => d.stocked) ?? [0])
  );
  const maxShipped = Math.max(
    ...(monthly?.map((d: MonthlyData) => d.shipped) ?? [0])
  );
  const maxY = Math.max(maxStocked, maxShipped) * 1.05;

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
              {t("warehouseTransaction")}
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
                <BarChart accessibilityLayer data={warehouseInventory}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="warehouse"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    hide
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, props) => {
                          console.log(props);
                          return (
                            <div className=" flex items-center gap-2">
                              <div className={` h-2 w-2`}></div>
                              {`${t("stocked")}: ${value}`}
                            </div>
                          );
                        }}
                      />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="stocked" radius={[0, 0, 4, 4]}>
                    {warehouseInventory.map((_, i) => (
                      <Cell key={i} fill={`var(--chart-${(i % 5) + 1})`} />
                    ))}
                    <LabelList
                      dataKey="stocked"
                      position="insideTop"
                      fontSize={12}
                      content={(props) => {
                        const { x, y, width, height, value } = props;

                        const barHeight = Number(height); // ensure it's a number
                        const barWidth = Number(width);
                        const posX = Number(x) + barWidth / 2;
                        // Determine Y position
                        // If bar is too short, render above; else inside
                        const isAbove = barHeight < 20;
                        const posY = isAbove ? Number(y) - 4 : Number(y) + 12;

                        // if (
                        //   !x ||
                        //   !y ||
                        //   !width ||
                        //   isNaN(barHeight) ||
                        //   barHeight < 20
                        // )
                        //   return null;

                        return (
                          <text
                            x={posX}
                            y={posY}
                            //  fill="background"
                            fill={isAbove ? "var(--foreground)" : "background"}
                            textAnchor="middle"
                            fontSize={12}
                            fontWeight="bold"
                          >
                            {value}
                          </text>
                        );
                      }}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Monthly Overview */}
        <Card className="col-span-3 flex flex-col">
          <CardHeader>
            <CardTitle className="text-primary">
              {t("monthlyOverview")}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            {transactionLoading ? (
              <Skeleton className="h-[calc(40vh-80px)] w-full" />
            ) : (
              <ChartContainer
                config={chartConfig}
                className="h-[calc(40vh-80px)] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    accessibilityLayer
                    data={monthly ?? []}
                    margin={{ right: 12, left: 14, bottom: 20 }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month_name"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => {
                        const translated = t(`months.${value}`, {
                          fallback: value,
                        });
                        return translated.slice(0, 3);
                      }}
                      domain={[0, maxY]}
                    />
                    <YAxis
                      type="number"
                      tickLine={false}
                      axisLine={false}
                      domain={[0, maxY]}
                      hide
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
                </ResponsiveContainer>
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
};

export default DashboardContent;
