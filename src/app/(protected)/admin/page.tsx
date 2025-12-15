/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(protected)/admin/page.tsx
"use client";
import { ProtectedRoute } from "@/features/auth/components/protected-route";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserHooks } from "@/features/admin/hooks/useUsersHooks";
import { useWarehouseHooks } from "@/features/admin/hooks/useWarehousesHooks";
import { useRecipientHooks } from "@/features/admin/hooks/useRecipientsHooks";
import { useState } from "react";
import { useIsMobile } from "@/hooks/useMobile";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { UserTab } from "@/features/admin/components/usersTab";
import { RecipientsTab } from "@/features/admin/components/recipientsTab";
import { WarehouseTab } from "@/features/admin/components/warehouseTab";
import { EditUserDialog } from "@/features/admin/components/editUserDialog";
import { EditWarehouseDialog } from "@/features/admin/components/editWarehouseDialog";
import Loader from "@/components/ui/loader";
import { User, Recipient, Warehouse } from "@/types/admin";
import { useEffect } from "react";

export default function AdminPage() {
  const { users, userLoading, refetchuser } = useUserHooks();
  const { warehouseWorker, warehouseLoading, refetchwarehouse } =
    useWarehouseHooks();
  const {
    recipients,
    recipientLoading,
    handleActiveChange,
    refetchRecipients,
  } = useRecipientHooks();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(
    null
  );
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [editWarehouseOpen, setEditWarehouseOpen] = useState(false);

  const isMobile = useIsMobile();
  const router = useRouter();
  const t = useTranslations("Table");

  useEffect(() => {
    if (isMobile) {
      router.replace("/"); // or any page you want to redirect to
    }
  }, [isMobile, router]);

  const userColumns: ColumnDef<User>[] = [
    {
      accessorKey: "username",
      header: t("username"),
    },
    {
      accessorKey: "email",
      header: t("email"),
    },
    {
      accessorKey: "role",
      header: t("role"),
      cell: ({ row }) => {
        const user = row.original;
        return <div>{user?.role === "admin" ? t("admin") : t("worker")}</div>;
      },
    },
    {
      accessorKey: "warehouse",
      header: t("warehouse"),
    },
    {
      id: "actions",
      header: t("actions"),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Button
            onClick={() => {
              setSelectedUser(user);
              setEditUserOpen(true);
            }}
          >
            <Pencil className=" h-5" />
          </Button>
        );
      },
    },
  ];

  const recipientsColumns: ColumnDef<Recipient>[] = [
    {
      accessorKey: "email",
      header: t("email"),
    },
    {
      accessorKey: "isactive",
      header: t("status"),
      cell: ({ row, table }) => {
        const recipient = row.original;
        const toggle = table.options.meta?.onActiveChange;

        return (
          <Switch
            checked={recipient.isactive}
            onCheckedChange={(checked) => {
              toggle?.(recipient.id, checked);
            }}
          />
        );
      },
    },
    {
      accessorKey: "created_at",
      header: t("date"),
      cell: ({ row }) => {
        const recipient = row.original;
        const date = new Date(recipient.created_at).toLocaleDateString();
        return <p>{date}</p>;
      },
    },
  ];

  const warehouseColumns: ColumnDef<Warehouse>[] = [
    {
      accessorKey: "warehouse",
      header: t("warehouse"),
    },
    {
      accessorKey: "location",
      header: t("location"),
    },
    {
      accessorKey: "workers",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("workersNo")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      id: "actions",
      header: t("actions"),
      cell: ({ row }) => {
        const warehouse = row.original;
        return (
          <Button
            onClick={() => {
              setSelectedWarehouse(warehouse);
              setEditWarehouseOpen(true);
            }}
          >
            <Pencil className=" h-5" />
          </Button>
        );
      },
    },
  ];

  const loading = userLoading || warehouseLoading || recipientLoading;

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="p-4 gap-2 bg-linear-to-b from-primary/10 to-background">
        <Tabs defaultValue="users" className="space-y-1">
          <TabsList className=" bg-card w-full flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <TabsTrigger value="users">{t("users")}</TabsTrigger>
            <TabsTrigger value="email-recipients">
              {t("recipients")}
            </TabsTrigger>
            <TabsTrigger value="warehouses">{t("warehouses")}</TabsTrigger>
          </TabsList>
          <TabsContent value="users" className="space-y-2">
            <UserTab
              columns={userColumns}
              data={users}
              loading={userLoading}
              fetchUsersData={refetchuser}
            />
          </TabsContent>
          <TabsContent value="email-recipients" className="space-y-2">
            <RecipientsTab
              columns={recipientsColumns}
              data={recipients}
              loading={recipientLoading}
              onActiveChange={handleActiveChange}
              fetchRecipientData={refetchRecipients}
            />
          </TabsContent>
          <TabsContent value="warehouses" className="space-y-2">
            <WarehouseTab
              columns={warehouseColumns}
              data={warehouseWorker}
              loading={warehouseLoading}
              fetchWarehouseData={refetchwarehouse}
            />
          </TabsContent>
        </Tabs>
        <EditUserDialog
          open={editUserOpen}
          onOpenChange={setEditUserOpen}
          user={selectedUser}
          onUserEdit={refetchuser}
        />
        <EditWarehouseDialog
          open={editWarehouseOpen}
          onOpenChange={setEditWarehouseOpen}
          warehouse={selectedWarehouse}
          onWarehouseEdit={refetchwarehouse}
        />
      </main>
    </ProtectedRoute>
  );
}
