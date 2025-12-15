"use client";

import { useEffect, useState } from "react";
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
import { editWarehouse } from "@/features/admin/services/editWarehouse";
import toast from "react-hot-toast";
import { Warehouse } from "@/types/admin";
import { useTranslations } from "next-intl";

interface EditWarehouseDialogProps {
  warehouse: Warehouse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  onWarehouseEdit: () => void;
}

export function EditWarehouseDialog({
  warehouse,
  open,
  onOpenChange,
  onSuccess,
  onWarehouseEdit,
}: EditWarehouseDialogProps) {
  const [formData, setFormData] = useState({ warehouse: "", location: "" });
  const [loading, setLoading] = useState(false);
  const t = useTranslations("editWarehouse");

  useEffect(() => {
    if (warehouse) {
      setFormData({
        warehouse: warehouse.warehouse,
        location: warehouse.location,
      });
    }
  }, [warehouse]);

  const handleSubmit = async () => {
    if (!warehouse) return;
    setLoading(true);

    try {
      const result = await editWarehouse(warehouse.id, formData);

      if (result.success) {
        toast.success(t("success"));
        onSuccess?.();
        onWarehouseEdit();
        onOpenChange(false);
      } else {
        toast.error(result.message || t("error"));
      }
    } catch (err) {
      toast.error(t("error"));
    } finally {
      setLoading(false);
    }
  };

  if (!warehouse) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("header")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Warehouse Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label>{t("warehouseName")}</Label>
            <Input
              value={formData.warehouse}
              onChange={(e) =>
                setFormData({ ...formData, warehouse: e.target.value })
              }
              className="col-span-3"
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label>{t("location")}</Label>
            <Input
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="col-span-3"
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? t("loadingState") : t("button")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
