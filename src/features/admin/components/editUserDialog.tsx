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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { editUser } from "@/features/admin/services/editUser";
import toast from "react-hot-toast";
import { User } from "@/types/admin";

interface EditUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditUserDialog({
  user,
  open,
  onOpenChange,
  onSuccess,
}: EditUserDialogProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "worker",
  });

  const [loading, setLoading] = useState(false);
  const t = useTranslations("editUser");

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        role: user.role,
      });
    }
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const result = await editUser(user.id, formData);

      if (result.success) {
        toast.success(t("success"));
        onSuccess?.();
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

  if (!user) return null;

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

          {/* Email */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label>{t("email")}</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="col-span-3"
            />
          </div>

          {/* Role */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label>{t("role")}</Label>
            <Select
              value={formData.role}
              onValueChange={(v) => handleChange("role", v)}
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
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? t("saving") : t("button")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
