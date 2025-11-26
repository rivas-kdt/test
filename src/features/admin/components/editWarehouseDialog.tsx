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
import type { Warehouse } from "@/app/admin/page";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface EditWarehouseDialogProps {
  warehouse: Warehouse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditWarehouseDialog({
  warehouse,
  open,
  onOpenChange,
  onSuccess,
}: EditWarehouseDialogProps) {
  const [formData, setFormData] = useState({
    warehouse: "",
    location: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations('editWarehouse')

  useEffect(() => {
    if (warehouse) {
      setFormData({
        warehouse: warehouse.warehouse || "",
        location: warehouse.location || "",
      });
    }
  }, [warehouse]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!warehouse) return;

    setIsLoading(true);
    try {
      const payload = {
        warehouseID: warehouse.id,
        warehouse:
          formData.warehouse !== warehouse.warehouse
            ? formData.warehouse
            : undefined,
        location:
          formData.location !== warehouse.location
            ? formData.location
            : undefined,
      };

      const response = await fetch("/api/v2/warehouse", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.success) {
        router.refresh();
        onOpenChange(false);
        onSuccess?.();
      } else {
        console.error("Error updating warehouse:", result.error);
      }
    } catch (error) {
      console.error("Exception in handleSubmit:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!warehouse) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] z-50">
        <DialogHeader>
          <DialogTitle>{t('header')}</DialogTitle>
          <DialogDescription>
            {t('description')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="warehouse" className="text-right">
              {t('warehouseName')}
            </Label>
            <Input
              id="warehouse"
              value={formData.warehouse}
              onChange={(e) => handleChange("warehouse", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              {t('location')}
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-amber-400 hover:bg-amber-400/75 text-black"
          >
            {isLoading ? t('addingState') : t('button')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
