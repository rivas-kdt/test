"use client";
import type React from "react";
import { useState } from "react";
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
// import { addWarehouse } from "@/actions/dbActions"; //TODO Change this
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { addWarehouse } from "../services/addWarehouse";
import toast from "react-hot-toast";

interface AddWarehouseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  onWarehouseAdded?: () => void;
}

export function AddWarehouseForm({
  open,
  onOpenChange,
  onSuccess,
  onWarehouseAdded,
}: AddWarehouseFormProps) {
  const [warehouse, setWarehouse] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const t = useTranslations("addNewWarehouse");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("warehouse", warehouse);
      formData.append("location", location);

      const result = await addWarehouse(warehouse, location);

      if (result.success && result.message) {
        if (onWarehouseAdded) onWarehouseAdded();
        toast.success(result.message);
        resetForm();
        onOpenChange(false);
        if (onSuccess) onSuccess();
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Error adding warehouse: ", error);
      toast.error("An Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setWarehouse("");
    setLocation("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-background">
        <DialogHeader>
          <DialogTitle>{t("header")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="warehouse" className="text-right">
                {t("warehouseName")}
              </Label>
              <Input
                id="warehouse"
                value={warehouse}
                onChange={(e) => setWarehouse(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                {t("location")}
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("addingState")}
                </>
              ) : (
                t("button")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
