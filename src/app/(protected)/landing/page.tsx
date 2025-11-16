// "use client";
// import React from "react";
// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Package, Truck, MapPin, Loader2 } from "lucide-react";
// import Link from "next/link";
// // import { get } from "@/actions/cookieHandler";
// // import { jwtDecode } from "jwt-decode";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useTranslations } from "next-intl";
// import { useIsMobile } from "@/hooks/useMobile";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";
// import { useAuth } from "@/features/auth/hooks/useAuth";
// import Loader from "@/components/ui/loader";
// import { useLanding } from "@/features/landing/hooks/useLanding";

// interface Warehouse {
//   id: string;
//   location: string;
//   warehouse: string;
// }

// interface User {
//   id: string;
//   username: string;
//   role: "admin" | "worker";
//   warehouse?: string;
//   location?: string;
// }

// type LoadingState = {
//   loading: boolean;
//   user: User | null | undefined;
// };

// const LandingMobile = () => {
//   const { user } = useAuth(true);
//   const loadingState: LoadingState = {
//     loading: true,
//     user: user as User | null,
//   };
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const typedUser: User | null =
//     user && typeof user === "object" && "id" in user ? (user as User) : null;
//   //   const [warehouse, setWarehouse] = useState<Warehouse[]>([]);
//   const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(
//     null
//   );
//   const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
//   const [loadingWarehouses, setLoadingWarehouses] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const isAdmin = typedUser?.role === "admin";
//   const isMobile = useIsMobile();
//   const t = useTranslations("landing-page");

//   const { warehouse } = useLanding();

//   // If user is using desktop, redirect him to /dashboard
//   //   useEffect(() => {
//   //     if (isMobile === undefined) return; // wait for detection

//   //     if (!isMobile) {
//   //       router.push("/dashboard");
//   //     } else {
//   //       setLoading(false);
//   //     }
//   //   }, [isMobile, router]);

//   //   useEffect(() => {
//   //     if (!typedUser) return; // Prevent running if user is not loaded

//   //     const warehouseData = async () => {
//   //       const token = await get("jwt");

//   //       if (token) {
//   //         try {
//   //           const decoded = jwtDecode<{ role: string; location: string }>(token);
//   //           setSelectedLocation(decoded.location);
//   //         } catch (error) {
//   //           console.error("Error decoding JWT:", error);
//   //         }
//   //       }

//   //       let fetchedWarehouses = [];
//   //       if (isAdmin) {
//   //         const { data, error } = await supabase.from("warehouse").select();
//   //         if (error) {
//   //           console.error(error);
//   //           setError("Failed to fetch warehouse");
//   //           return;
//   //         }
//   //         fetchedWarehouses = data;
//   //       } else {
//   //         if (!typedUser.location) {
//   //           setError("Worker has no assigned location.");
//   //           return;
//   //         }

//   //         const { data, error } = await supabase
//   //           .from("warehouse")
//   //           .select()
//   //           .eq("location", typedUser.location);

//   //         if (error) {
//   //           console.error(error);
//   //           setError("Failed to fetch warehouse");
//   //           return;
//   //         }
//   //         fetchedWarehouses = data;
//   //       }

//   //       setWarehouse(fetchedWarehouses);
//   //       if (fetchedWarehouses.length > 0 && !selectedWarehouse) {
//   //         setSelectedWarehouse(fetchedWarehouses[0]);
//   //       }
//   //     };

//   //     warehouseData();
//   //   }, [typedUser, isAdmin, selectedWarehouse]);

//   useEffect(() => {
//     const fetchWarehouses = async () => {
//       setLoadingWarehouses(true);
//       let fetchedWarehouses = [];

//       try {
//         let response;
//         if (isAdmin) {
//           response = await supabase.from("warehouse").select();
//         } else if (typedUser?.location) {
//           response = await supabase
//             .from("warehouse")
//             .select()
//             .eq("location", typedUser.location);
//         }
//         if (response?.error) throw response.error;
//         fetchedWarehouses = response?.data || [];
//         setWarehouse(fetchedWarehouses);
//         if (fetchedWarehouses.length > 0) {
//           const storedWarehouseId = sessionStorage.getItem(
//             "selectedWarehouseId"
//           );
//           const defaultWarehouse = storedWarehouseId
//             ? fetchedWarehouses.find((w) => w.id === storedWarehouseId)
//             : fetchedWarehouses[0];
//           setSelectedWarehouse(defaultWarehouse);
//           sessionStorage.setItem("selectedWarehouseId", defaultWarehouse.id);
//           sessionStorage.setItem(
//             "selectedWarehouse",
//             JSON.stringify(defaultWarehouse)
//           );
//         }
//       } catch (error) {
//         console.error("Error fetching warehouses:", error);
//         setError("Failed to fetch warehouse data");
//       } finally {
//         setLoadingWarehouses(false);
//       }
//     };
//     fetchWarehouses();
//   }, [isAdmin, typedUser]);

//   const handleWarehouseChange = (warehouseId: string) => {
//     const selected = warehouse.find((w) => w.id === warehouseId);
//     if (selected) {
//       setSelectedWarehouse(selected);
//       sessionStorage.setItem("selectedWarehouseId", selected.id);
//       sessionStorage.setItem("selectedWarehouse", JSON.stringify(selected));
//     } else {
//       setSelectedWarehouse(null);
//       sessionStorage.removeItem("selectedWarehouseId");
//       sessionStorage.removeItem("selectedWarehouse");
//     }
//   };

//   //   useEffect(() => {
//   //     const storedWarehouseId = sessionStorage.getItem("selectedWarehouseId");
//   //     if (storedWarehouseId && warehouse.length > 0) {
//   //       const storedWarehouse = warehouse.find((w) => w.id === storedWarehouseId);
//   //       if (storedWarehouse) {
//   //         setSelectedWarehouse(storedWarehouse);
//   //       }
//   //     }
//   //   }, [warehouse]);

//   //   useEffect(() => {
//   //     if (!typedUser) return;

//   //     const hasJustLoggedIn = sessionStorage.getItem("hasJustLoggedIn");

//   //     if (hasJustLoggedIn === "true") {
//   //       toast.success(
//   //         typedUser.role === "admin" ? t("you-are-admin") : t("you-are-worker")
//   //       );
//   //       sessionStorage.removeItem("hasJustLoggedIn");
//   //     }
//   //   }, [typedUser, t]);

//   console.log(user);

//   return (
//     <div className="flex flex-col w-screen min-h-screen p-4 pt-24 bg-linear-to-b from-primary/10 to-background">
//       <Card className="mb-4 border-0 shadow-md">
//         <CardHeader className="pb-2">
//           <CardTitle className="text-2xl font-medium">
//             {t("welcome-message")}
//           </CardTitle>
//           <CardDescription className="text-xl font-medium text-primary">
//             {user?.username || t("guest")}
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-3">
//             {isAdmin ? (
//               <>
//                 <label className="flex text-md font-medium">
//                   {t("selectWarehouse")}
//                 </label>
//                 <Select
//                   value={selectedWarehouse?.id}
//                   onValueChange={handleWarehouseChange}
//                   disabled={loadingWarehouses}
//                 >
//                   <SelectTrigger className="flex w-full h-[50px]">
//                     <SelectValue placeholder={t("select-1")} />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {loadingWarehouses ? (
//                       <div className="flex items-center justify-center py-2 h-[50px] text-md">
//                         <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                         <span>{t("loading")}</span>
//                       </div>
//                     ) : (
//                       warehouse.map((warehouse) => (
//                         <SelectItem
//                           key={warehouse.id}
//                           value={warehouse.id}
//                           className="py-4"
//                         >
//                           {warehouse.warehouse}
//                         </SelectItem>
//                       ))
//                     )}
//                   </SelectContent>
//                 </Select>
//               </>
//             ) : (
//               <div className="bg-muted/50 p-3 rounded-md">
//                 <p className="text-sm font-medium">{t("assigned")}</p>
//                 <p className="text-base font-semibold">
//                   {selectedWarehouse?.warehouse || t("errorXAssign")}
//                 </p>
//               </div>
//             )}
//             {isAdmin
//               ? selectedWarehouse && (
//                   <div className="mt-2">
//                     <label className="text-md font-medium flex mb-2">
//                       {t("location")}
//                     </label>
//                     <div className="flex items-center p-2 border rounded-md bg-muted/30 h-[50px]">
//                       <MapPin className="h-4 w-4 mr-2" />
//                       <span className="text-sm">
//                         {selectedWarehouse?.location || t("errorLocX")}
//                       </span>
//                     </div>
//                   </div>
//                 )
//               : selectedWarehouse && (
//                   <div className="mt-2">
//                     <label className="text-sm font-medium">
//                       {t("location")}
//                     </label>
//                     <div className="flex items-center p-2 border rounded-md bg-muted/30">
//                       <MapPin className="h-4 w-4 mr-2" />
//                       <span className="text-sm">
//                         {selectedLocation || t("errorLocX")}
//                       </span>
//                     </div>
//                   </div>
//                 )}
//           </div>
//         </CardContent>
//       </Card>
//       <div className="grid gap-4">
//         <Button
//           className="py-8 flex items-center justify-center gap-2 rounded-xl shadow-md bg-primary w-full"
//           onClick={() => {
//             setLoading(true);
//             router.push("/test/stock");
//           }}
//           disabled={loading}
//         >
//           {loading ? (
//             <Loader2 className="w-5 h-5 animate-spin" />
//           ) : (
//             <>
//               <Package style={{ width: "25px", height: "25px" }} />
//               <span className="text-lg">{t("stockItem")}</span>
//             </>
//           )}
//         </Button>

//         <Button
//           className="py-8 flex items-center justify-center gap-2 rounded-xl shadow-md bg-primary w-full"
//           onClick={() => {
//             setLoading(true);
//             router.push("/test/ship");
//           }}
//           disabled={loading}
//         >
//           {loading ? (
//             <Loader2 className="w-5 h-5 animate-spin" />
//           ) : (
//             <>
//               <Truck style={{ width: "25px", height: "25px" }} />
//               <span className="text-lg">{t("shipItem")}</span>
//             </>
//           )}
//         </Button>
//       </div>

//       <p className="text-center text-xs text-muted-foreground mt-auto pt-4">
//         {t("p1")}
//       </p>

//       {loading && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-black/80">
//           <Loader />
//         </div>
//       )}
//     </div>
//   );
// };

// export default LandingMobile;

import React from "react";

const page = () => {
  return <div>page</div>;
};

export default page;
