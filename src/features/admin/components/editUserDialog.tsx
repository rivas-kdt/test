"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

import { editUser } from "@/features/admin/services/editUser";
import { User } from "@/types/admin";
import { Warehouse } from "@/types/warehouse";
import { getWarehouse } from "@/features/inventory/services/getWarehouse";

interface EditUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  onUserEdit: () => void;
}

interface EditUserForm {
  username: string;
  email: string;
  role: "admin" | "worker";
  warehouse_id: string;
}

export function EditUserDialog({
  user,
  open,
  onOpenChange,
  onSuccess,
  onUserEdit,
}: EditUserDialogProps) {
  const t = useTranslations("editUser");

  const [formData, setFormData] = useState<EditUserForm>({
    username: "",
    email: "",
    role: "worker",
    warehouse_id: "",
  });

  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(false);

  // ================================
  // Load user data into form
  // ================================
  useEffect(() => {
    if (!user) return;

    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
      warehouse_id: user.warehouse_id ?? "",
    });
  }, [user]);

  // ================================
  // Load warehouse list
  // ================================
  useEffect(() => {
    (async () => {
      try {
        const list = await getWarehouse();
        setWarehouses(list);
      } catch {
        toast.error("Failed to load warehouses");
      }
    })();
  }, []);

  // ================================
  // Field update handler
  // ================================
  const handleChange = useCallback(
    (field: keyof EditUserForm, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // ================================
  // Submit handler
  // ================================
  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const result = await editUser(user.id, formData);

      if (!result.success) {
        toast.error(result.message || t("error"));
        return;
      }

      toast.success(t("success"));
      onSuccess?.();
      onUserEdit();
      onOpenChange(false);
    } catch {
      toast.error(t("error"));
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  // ================================
  // UI
  // ================================
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("header")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Username */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label>{t("username")}</Label>
            <Input
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
              className="col-span-3"
            />
          </div>

          {/* Email (locked) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label>{t("email")}</Label>
            <Input
              value={formData.email}
              disabled
              className="col-span-3 bg-muted cursor-not-allowed"
            />
          </div>

          {/* Role */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label>{t("role")}</Label>
            <Select
              value={formData.role}
              onValueChange={(v) =>
                handleChange("role", v as EditUserForm["role"])
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">{t("admin")}</SelectItem>
                <SelectItem value="worker">{t("worker")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Warehouse */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label>{t("warehouse")}</Label>

            <Select
              value={formData.warehouse_id}
              onValueChange={(v) => handleChange("warehouse_id", v)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={t("selectWarehouse")} />
              </SelectTrigger>
              <SelectContent>
                {warehouses.length === 0 && (
                  <SelectItem value="">{t("noWarehouse")}</SelectItem>
                )}
                {warehouses.map((w) => (
                  <SelectItem key={w.id} value={String(w.id)}>
                    {w.warehouse}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button disabled={loading} onClick={handleSubmit}>
            {loading ? t("loadingState") : t("button")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
